# Role-Based Waitlist System

## Overview

Cudliy now features a comprehensive role-based waitlist registration system that categorizes users based on their intended use of the platform. This allows us to better understand our user base and tailor the platform experience to different user types.

## User Roles

### 1. Casual Users
- **Browsers**: Users who want to explore pre-made models with little or no customization
- **Light Customizers**: Users interested in tweaking existing designs in small ways, enjoying personalization

### 2. Dedicated Designers
- **Hobbyist Designers**: Those who love designing toys just for personal fun and creativity
- **Entrepreneurial Designers**: Creators interested in potentially selling their designs or collaborating with others

### 3. 3D Printer Partners
- **Individual Printers**: People with 1-2 printers who want to do small-scale printing as a side gig
- **Small Business Partners**: Those with larger printing setups who want formal ongoing partnerships

## Database Schema

The waitlist table has been extended with the following new fields:

```sql
ALTER TABLE public.waitlist 
ADD COLUMN role TEXT,
ADD COLUMN experience TEXT,
ADD COLUMN goals TEXT,
ADD COLUMN printer_setup TEXT,
ADD COLUMN business_name TEXT,
ADD COLUMN website TEXT;
```

### Role Constraints
- `role` must be one of: `browser`, `light_customizer`, `hobbyist_designer`, `entrepreneurial_designer`, `individual_printer`, `small_business_partner`
- All new fields are optional except for the basic registration fields (first_name, last_name, email)

## UI Features

### New Landing Page Design
- **Dark Theme**: Modern black background with gradient accents
- **Animated Background**: Subtle animated gradient elements
- **Role Selection**: Interactive cards for each user role
- **Progressive Form**: Shows additional fields based on selected role
- **Responsive Design**: Works seamlessly on all device sizes

### Form Features
- **Role Selection**: Visual cards with icons and descriptions
- **Conditional Fields**: Printer-specific questions for 3D printer partners
- **Validation**: Real-time form validation with helpful error messages
- **Loading States**: Smooth loading animations during submission
- **Success Feedback**: Toast notifications for successful registration

## Technical Implementation

### Components
- `RoleBasedWaitlistForm`: Main form component with role selection
- Updated `Index.tsx`: New landing page with dark theme
- Database migration: `20250101000000-add-role-based-fields.sql`

### Styling
- Dark theme with blue/purple gradient accents
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Responsive grid layouts

### Database Integration
- Supabase integration with updated types
- Row-level security policies maintained
- Proper error handling for duplicate emails
- Index on role field for better query performance

## Usage

1. Users visit the landing page
2. They select their role from the visual cards
3. Fill in basic personal information
4. Complete role-specific questions (if applicable)
5. Submit the form to join the waitlist
6. Receive confirmation via toast notification

## Future Enhancements

- Analytics dashboard for role distribution
- Role-based email campaigns
- Custom onboarding flows per role
- Role-specific feature previews
- Partner program management for 3D printer partners
