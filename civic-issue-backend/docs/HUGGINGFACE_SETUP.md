# Hugging Face API Setup for Issue Classification

This document explains how to set up the Hugging Face API for automatic issue categorization.

## Prerequisites

1. A Hugging Face account
2. A Hugging Face API token

## Setup Steps

### 1. Get Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token

### 2. Add Environment Variable

Add the following to your `.env` file:

```bash
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
```

### 3. Install Dependencies

The required dependency is already added to `package.json`:

```bash
npm install
```

## How It Works

### Classification Process

1. **AI Classification**: Uses Facebook's BART model for zero-shot classification
2. **Keyword Fallback**: If AI confidence is low, falls back to keyword matching
3. **Default Category**: If all else fails, assigns "General Complaints"

### Categories

The system classifies issues into 10 categories:

1. **Roads and Infrastructure** - Potholes, road damage, sidewalks
2. **Water and Sewage** - Water leaks, drainage issues, sewage problems
3. **Electricity and Power** - Power outages, street lights, electrical issues
4. **Waste Management** - Garbage collection, recycling, litter
5. **Public Safety** - Crime, security concerns, safety hazards
6. **Parks and Recreation** - Park maintenance, playground equipment
7. **Traffic and Transportation** - Traffic signals, public transport, parking
8. **Environmental Issues** - Pollution, air quality, noise complaints
9. **Housing and Buildings** - Building maintenance, housing issues
10. **General Complaints** - Other issues not fitting specific categories

### API Endpoints

- `GET /api/issues/categories` - Get all available categories
- `POST /api/issues/classify` - Classify text without creating an issue

### Database Schema

New fields added to the Issue model:

- `predictedCategory` - The AI-predicted category
- `categoryConfidence` - Confidence score (0-1)
- `categoryMethod` - How the category was determined

## Testing

You can test the classification by sending a POST request to `/api/issues/classify`:

```bash
curl -X POST http://localhost:5000/api/issues/classify \
  -H "Content-Type: application/json" \
  -d '{"title": "Broken street light", "description": "The street light on Main Street is not working"}'
```

## Troubleshooting

### Common Issues

1. **API Key Not Set**: Make sure `HUGGINGFACE_API_KEY` is in your `.env` file
2. **Network Issues**: Check your internet connection
3. **Rate Limiting**: Hugging Face has rate limits for free accounts

### Fallback Behavior

If the Hugging Face API fails, the system will:

1. Try keyword-based classification
2. Default to "General Complaints" category
3. Continue with issue creation (won't fail the entire process)

## Cost Considerations

- Hugging Face offers free tier with limited requests
- Consider upgrading to a paid plan for production use
- Monitor your API usage in the Hugging Face dashboard
