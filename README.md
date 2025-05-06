# EzKYC - Zero-Knowledge KYC Solution

![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

<div align="center">
  <h3>Secure, Private, and Compliant KYC Solution Provider</h3>
</div>

## 📝 Project Overview

EzKYC is a Know Your Customer (KYC) solution based on zero-knowledge proof technology, designed to protect user privacy while meeting compliance requirements. The platform provides a secure and transparent identity verification process for both businesses and users.

## 🚀 Quick Start

### Install Dependencies

```bash
#Uing yarn
yarn install
```

### Run Development Server

- On Vercel, in `Storage`, configure an Upstash For Redis database. Copy `.env.example` to `.env` and add your environment variables.
- Update `VERIFIER_URL` to ngrok interface when develop locally

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Project Structure

- `/app` - Next.js application pages
  - `/company` - Company portal
  - `/user` - User verification flow
- `/components` - Reusable components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and constants
- `/public` - Static assets
- `/pages/api` - Api services


