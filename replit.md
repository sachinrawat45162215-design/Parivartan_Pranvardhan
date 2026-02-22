# PranVardhan - Rural Healthcare Mobile App

## Overview
PranVardhan is a comprehensive rural healthcare mobile application built with React Native and Expo Router, targeting digital health access challenges in rural India. The app supports both Hindi and English languages.

## Recent Changes
- **Feb 2026**: Renamed app from "Sehat Sathi" to "PranVardhan"
- **Feb 2026**: Added full multilingual support (Hindi & English) with language toggle
- **Feb 2026**: Created i18n system with translations for all UI strings, symptom names, and health recommendations

## Architecture
- **Frontend**: React Native with Expo Router (file-based routing)
- **Backend**: Express server on port 5000 (serves landing page and API)
- **State**: AsyncStorage for local persistence (contacts, visits, articles, language preference)
- **i18n**: Custom language context (`lib/language-context.tsx`) with translations in `lib/i18n.ts`

## Key Files
- `lib/i18n.ts` - All translations for Hindi and English
- `lib/language-context.tsx` - Language provider with AsyncStorage persistence
- `lib/health-data.ts` - Health articles, symptom areas, and analysis logic
- `lib/storage.ts` - AsyncStorage helpers for contacts, visits, profiles
- `constants/colors.ts` - Theme colors (teal/coral/green)
- `app/(tabs)/` - Main tab screens (Home, Health Hub, SOS, ASHA)
- `app/symptom-checker.tsx` - Body-area symptom checker with severity analysis
- `app/article/[id].tsx` - Health article detail view
- `app/add-contact.tsx` - Emergency contact form
- `app/add-visit.tsx` - Patient visit logging form

## Features
1. **Home**: Health tips, quick actions, service cards, emergency numbers
2. **Health Hub**: 10 articles across 6 categories with save/bookmark
3. **SOS**: One-tap 108 calling, emergency numbers, personal contacts
4. **ASHA Dashboard**: Patient visit logging with categories and follow-ups
5. **Symptom Checker**: Body area selection, symptom severity, recommendations
6. **Language Toggle**: Switch between Hindi and English (persisted)

## User Preferences
- Nunito font family for friendly, accessible feel
- Warm teal (#0D9488) / coral / green color scheme
- No backend database - all data stored locally via AsyncStorage

## Project Structure
```
app/
  _layout.tsx           # Root layout with providers
  (tabs)/
    _layout.tsx         # Tab navigation
    index.tsx           # Home screen
    health-hub.tsx      # Health articles
    sos.tsx             # Emergency services
    asha.tsx            # ASHA worker dashboard
  symptom-checker.tsx   # Symptom analysis
  article/[id].tsx      # Article detail
  add-contact.tsx       # Add emergency contact
  add-visit.tsx         # Log patient visit
lib/
  i18n.ts              # Translation strings
  language-context.tsx  # Language provider
  health-data.ts       # Health content data
  storage.ts           # AsyncStorage helpers
  query-client.ts      # React Query client
constants/
  colors.ts            # Theme colors
```
