-- Create outage_notification_subscriptions table for push notifications
CREATE TABLE IF NOT EXISTS outage_notification_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  district_id TEXT NOT NULL,
  district_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_outage_notification_subscriptions_user_id ON outage_notification_subscriptions(user_id);
CREATE INDEX idx_outage_notification_subscriptions_district_id ON outage_notification_subscriptions(district_id);

-- Enable RLS (Row Level Security)
ALTER TABLE outage_notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own subscriptions
CREATE POLICY "Users can manage their own notification subscriptions" ON outage_notification_subscriptions
  FOR ALL USING (user_id = auth.jwt() ->> 'user_id');

-- Create policy for public read access (needed for Edge Functions to send notifications)
CREATE POLICY "Enable read access for all users" ON outage_notification_subscriptions
  FOR SELECT USING (true);
