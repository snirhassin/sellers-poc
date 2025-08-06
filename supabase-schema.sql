-- Supabase Database Schema for SellersMedia POC
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create seller_asins table
CREATE TABLE seller_asins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asin VARCHAR(20) NOT NULL,
  market VARCHAR(10) NOT NULL CHECK (market IN ('US', 'UK', 'DE', 'FR', 'IT', 'ES', 'CA', 'JP')),
  rate DECIMAL(5,2) NOT NULL CHECK (rate >= 0 AND rate <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate ASIN-market combinations per user
CREATE UNIQUE INDEX seller_asins_user_asin_market_idx ON seller_asins(user_id, asin, market);

-- Create index for better performance
CREATE INDEX seller_asins_user_id_idx ON seller_asins(user_id);

-- Create performance_reports table (for future mock data)
CREATE TABLE performance_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asin VARCHAR(20) NOT NULL,
  market VARCHAR(10) NOT NULL,
  report_date DATE NOT NULL,
  revenue DECIMAL(10,2) DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance reports
CREATE INDEX performance_reports_user_date_idx ON performance_reports(user_id, report_date);

-- Row Level Security Policies
-- Users can only access their own ASINs
CREATE POLICY "Users can view their own ASINs" ON seller_asins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ASINs" ON seller_asins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ASINs" ON seller_asins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ASINs" ON seller_asins
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only access their own performance reports
CREATE POLICY "Users can view their own reports" ON performance_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON performance_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on tables
ALTER TABLE seller_asins ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reports ENABLE ROW LEVEL SECURITY;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_seller_asins_updated_at 
  BEFORE UPDATE ON seller_asins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate mock performance data (for development/demo)
CREATE OR REPLACE FUNCTION generate_mock_performance_data()
RETURNS VOID AS $$
DECLARE
  asin_record RECORD;
  last_month_date DATE;
BEGIN
  -- Calculate last month
  last_month_date := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE;
  
  -- Delete existing mock data for last month
  DELETE FROM performance_reports WHERE report_date = last_month_date;
  
  -- Generate mock data for each user's ASINs
  FOR asin_record IN 
    SELECT user_id, asin, market, rate FROM seller_asins
  LOOP
    INSERT INTO performance_reports (
      user_id,
      asin,
      market,
      report_date,
      revenue,
      clicks,
      conversions,
      conversion_rate
    ) VALUES (
      asin_record.user_id,
      asin_record.asin,
      asin_record.market,
      last_month_date,
      (RANDOM() * 500 + 50) * (asin_record.rate / 100), -- Revenue based on rate
      FLOOR(RANDOM() * 1000 + 100)::INTEGER, -- Random clicks
      FLOOR(RANDOM() * 50 + 5)::INTEGER, -- Random conversions
      (RANDOM() * 8 + 2) -- Random conversion rate 2-10%
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easier reporting
CREATE VIEW user_asin_performance AS
SELECT 
  sa.user_id,
  sa.asin,
  sa.market,
  sa.rate,
  pr.revenue,
  pr.clicks,
  pr.conversions,
  pr.conversion_rate,
  pr.report_date
FROM seller_asins sa
LEFT JOIN performance_reports pr ON sa.user_id = pr.user_id 
  AND sa.asin = pr.asin 
  AND sa.market = pr.market
  AND pr.report_date = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE;