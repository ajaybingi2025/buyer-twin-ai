CREATE TABLE IF NOT EXISTS buyers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    desired_locations JSONB NOT NULL,
    timeline TEXT NOT NULL,
    must_have_features JSONB NOT NULL,
    inquiry_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    address_label TEXT NOT NULL,
    city TEXT NOT NULL,
    price INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    sqft INTEGER NOT NULL,
    neighborhood TEXT NOT NULL,
    school_score INTEGER NOT NULL,
    commute_score INTEGER NOT NULL,
    tags JSONB NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS buyer_events (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    duration_seconds INTEGER,
    source_channel TEXT,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('agent', 'buyer')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE buyers
ADD COLUMN IF NOT EXISTS user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS decision_twins (
    id TEXT PRIMARY KEY,
    buyer_id TEXT UNIQUE NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    primary_driver TEXT NOT NULL,
    secondary_driver TEXT NOT NULL,
    price_sensitivity TEXT NOT NULL,
    urgency TEXT NOT NULL,
    tour_readiness TEXT NOT NULL,
    communication_angle TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    next_best_action TEXT NOT NULL,
    summary TEXT NOT NULL,
    generated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    address_label TEXT NOT NULL,
    city TEXT NOT NULL,
    price INTEGER NOT NULL,
    fit_score NUMERIC(6,2) NOT NULL,
    explanation TEXT NOT NULL,
    matching_factors JSONB NOT NULL,
    score_breakdown JSONB NOT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outreach_assets (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    sms_text TEXT NOT NULL,
    email_subject TEXT NOT NULL,
    email_body TEXT NOT NULL,
    call_script TEXT NOT NULL,
    generated_at TIMESTAMP NOT NULL
);