# Photon Robot Hub – Project Specification

## Overview

This application is an industrial inspection, robot information, documentation, and communication system for laser welding and cutting robots.

Operators perform mandatory routine checks on multiple robots during 3 daily shifts (morning, afternoon, night). The app replaces manual paperwork and provides:

- structured inspection workflows
- shift handover communication
- robot health tracking
- historical analytics
- maintenance insights
- robot documentation by customer, project, and Bauteil
- important update notifications for operators
- direct communication between supervisors, Bedieners/operators, and maintenance

The goal is to improve traceability, reduce machine downtime, standardize quality checks, and make the app the central place where operators can find the newest robot/project information before production starts.

---

## Tech Stack

Frontend:
- React (Vite)
- TypeScript
- TailwindCSS

Routing:
- react-router-dom

State & Forms:
- react-hook-form
- zod (validation)

Backend:
- Supabase (PostgreSQL + Auth)

Charts:
- recharts

UI helpers:
- lucide-react (icons)
- clsx
- tailwind-merge

---

## User Roles

### Operator
- Perform routine checks
- Submit inspection data
- Leave shift handover messages
- View robot status & history
- Read important robot, optic, project, and Bauteil updates
- Access relevant documentation for the robot they are working on
- Reply to supervisor/operator messages when clarification is needed

### Supervisor
- View analytics dashboard
- Monitor robot health
- Export inspection data
- Review issues across shifts
- Publish important updates to specific robots, halls, optics, projects, or all operators
- Contact operators/Bedieners directly inside the system
- Confirm that operators have seen critical notices

### Admin
- Manage robots
- Manage users
- Configure thresholds and rules
- Manage projects, customers, Bauteil documentation, and update categories

---

## Core Workflow

1. User logs in
2. Sees robot grid (overview of all robots)
3. Selects a robot
4. Lands on robot dashboard
5. Starts a new routine inspection
6. Submits inspection form
7. Leaves optional shift handover message
8. Data is stored and reflected in analytics

Additional information-system workflow:

1. Supervisor/admin creates or updates a customer project, Bauteil, program note, optic note, or documentation file
2. The update is assigned to a robot, optic, hall, customer, project, or operator group
3. Operators see unread critical updates on login, robot grid, and robot dashboard
4. Operator opens the update, reads the details, and optionally confirms it
5. Supervisor can see who has read/confirmed important updates
6. Operators and supervisors can discuss the update through comments or messages

---

## Pages

### 1. Login Page
- Username/password authentication
- Redirect to robot grid after login

---

### 2. Robot Grid (Home Page)
Displays all robots as cards.

Each card shows:
- Robot image
- Robot ID (e.g. AP2345)
- Robot name (e.g. Freya, Donna, Kabine V)
- Type (Laser Welding / Cutting)
- Status (Green / Yellow / Red)
- Location (Halle 1 / Halle 2 / Halle 3)
- Last inspection time
- Open issues
- Button: “Open Robot”

Future card indicators:
- unread critical update badge
- active project/customer badge
- missing routine check warning

---

### 3. Robot Dashboard Page

Contains:

#### Robot Summary
- Robot ID
- Status
- Station
- Last inspection
- Current health score

#### Quick Actions
- + New Routine Check
- View History
- Maintenance Log
- Analytics
- Shift Messages
- Documentation
- Important Updates

#### Charts
- Laser power over time
- TCP stability trend
- Failure frequency
- ALO/BEO optic trend with thresholds
- Shift, daily, weekly, and monthly laser views

#### Recent Issues
- List of last reported problems

#### Information System Summary
- Current customer/project on this robot
- Current Bauteil/program notes
- Latest documentation changes
- Unread important updates
- Contact operator/supervisor action

---

### 4. Routine Inspection Form

Used by operators during shifts.

Fields are recorded per optic where applicable. Many robots have ALO and BEO optics, and the same routine checks must be done for both optics.

- TCP Kontrolle (OK / Not OK corrected / Not OK report / Not done)
- Laser Leistung (number, max around 4000)
- Schuss (OK / Not OK / Not available)
- Drahtlage (OK / Not OK corrected / Not OK report / Not done)
- Cooling (OK / Not OK / Not available)
- Gas check (OK / Not OK / Not available)
- Comments (text)

Metadata:
- robot_id
- date
- shift
- operator

---

### 5. Inspection History Page

Table view of all inspections.

Columns:
- ID
- Robot ID
- Date
- Shift
- Operator
- TCP OK
- Laser Power
- Schuss
- Drahtlage OK
- Gas check
- Optic
- Comments

Filters:
- Date range (daily / weekly / monthly)
- Robot
- Shift
- Operator
- Only failures

---

### 6. Shift Handover Messages

Each shift can leave notes for the next operator.

Example:
- “Laser power slightly unstable, monitor TCP before start.”
- “Cooling system checked, all good.”

Displayed:
- on robot dashboard
- chronological feed
- linked to a robot, shift, optic, project, or Bauteil when needed

Communication ideas:
- supervisor can message operators/Bedieners directly
- operator can reply to clarify machine status
- messages can be marked as important
- unresolved messages can stay visible until closed

---

### 7. Analytics Dashboard

For supervisors/management.

Includes:
- Robot health score trends
- Laser power graphs
- TCP failure rate
- Shift comparison
- Most common issues
- threshold event tracking
- ALO/BEO comparison
- routine completion rate
- missing checks by shift
- recurring corrections by robot/optic

---

### 8. Robot Documentation / Information Page

This page turns the app into an information system for all robots.

Each robot can have documentation grouped by:
- Customer
- Project
- Bauteil / part
- Program number/version
- Optic (ALO / BEO)
- Robot / Kabine
- Hall
- Process type (laser welding / cutting)

Document types:
- setup instructions
- program notes
- Bauteil-specific instructions
- fixture/clamping information
- optic cleaning/calibration notes
- welding/cutting parameter notes
- quality requirements
- troubleshooting guides
- maintenance instructions
- PDFs, images, videos, or links

Important requirements:
- operators must always see the newest active documentation
- old versions should remain in history for traceability
- documentation should show who created/updated it and when
- documents should be searchable by robot, AP ID, Bauteil, customer, and project

---

### 9. Important Updates / Notifications

Supervisors need a way to notify operators about important changes.

Examples:
- program changed for a Bauteil
- new customer/project instruction
- optic issue on ALO or BEO
- temporary production restriction
- laser threshold warning
- fixture/clamping change
- quality problem or customer complaint
- maintenance notice
- machine can continue working but must be monitored
- machine must stop until supervisor/maintenance releases it

Update severity:
- Info: normal update
- Important: operator should read before production
- Critical: operator must confirm before continuing
- Stop Work: robot or optic must not be used until released

Targeting:
- all robots
- one robot
- one optic
- one hall
- one customer/project/Bauteil
- one shift
- one operator or operator group

Operator experience:
- unread update badge in navbar
- update badge on robot cards
- critical update modal before routine check
- confirmation button for critical updates
- comment/reply thread for questions

Supervisor experience:
- create update
- attach files/images
- choose target robots/operators
- see read/confirmed status
- close or archive update
- escalate unresolved critical updates

---

### 10. Operator Contact / Communication

The app should allow supervisors and operators to contact each other about what is happening on the shop floor.

Use cases:
- supervisor asks current operator for machine status
- operator reports something unusual during a shift
- maintenance asks for more details
- next shift asks what was corrected
- supervisor sends instruction to all operators on a robot

Message types:
- direct message
- robot discussion
- shift handover
- update comment thread
- maintenance discussion

Useful features:
- unread message count
- mention operator/supervisor
- attach photo/document
- mark message as resolved
- link message to robot, optic, inspection, Bauteil, or update

---

## Database Schema (Supabase)

### robots
- id
- name
- type
- location / hall
- status
- asset_id
- image_url
- optics

---

### inspections
- id
- robot_id
- date
- shift
- operator
- optic
- tcp_result
- laser_power (number)
- schuss_result
- drahtlage_result
- cooling_result
- gas_result
- comments (text)

---

### shift_messages
- id
- robot_id
- date
- shift
- message
- operator
- related_optic
- related_project_id
- is_important
- resolved_at

---

### maintenance_logs
- id
- robot_id
- date
- issue
- action_taken
- technician

---

### customers
- id
- name
- contact_info

---

### projects
- id
- customer_id
- name
- bauteil_number
- description
- status
- active_from
- active_to

---

### robot_projects
- id
- robot_id
- project_id
- optic
- program_number
- program_version
- active

---

### documents
- id
- title
- description
- file_url
- document_type
- customer_id
- project_id
- robot_id
- optic
- version
- created_by
- created_at
- archived_at

---

### important_updates
- id
- title
- message
- severity
- robot_id
- optic
- customer_id
- project_id
- hall
- shift
- created_by
- created_at
- expires_at
- requires_confirmation
- status

---

### update_confirmations
- id
- update_id
- user_id
- confirmed_at

---

### conversations
- id
- robot_id
- project_id
- inspection_id
- update_id
- subject
- status
- created_by
- created_at

---

### conversation_messages
- id
- conversation_id
- sender_id
- message
- attachment_url
- created_at
- read_at

---

## UI/UX Guidelines

- Industrial dashboard style
- Clean light theme by default
- Touch-friendly but space-efficient buttons
- Minimal typing required
- Fast workflow (optimized for factory environment)
- Color-coded status indicators:
  - Green = OK
  - Yellow = Warning
  - Red = Critical

---

## Key Design Principles

- Speed over complexity
- Mobile/tablet friendly
- One-click access to inspection form
- Clear robot status visibility
- Reduce cognitive load for operators

---

## Future Enhancements

- QR code scanning for robots
- Offline mode (PWA)
- Automatic alerts for failures and important updates
- Predictive maintenance (AI)
- Image uploads (defect documentation)
- PDF report generation
- Push notifications for critical issues
- Documentation search by customer/project/Bauteil
- Program version history
- Operator read confirmations for critical updates
- Direct supervisor/operator messaging
- File attachments and photo evidence

---

## MVP Scope (Phase 1)

Must build first:
1. Login page
2. Robot grid
3. Robot dashboard
4. Inspection form
5. Inspection history table
6. Shift handover messages

Everything else is secondary.

---

## Goal

Create a reliable internal industrial tool that replaces manual inspection logs and improves visibility into robot performance across shifts.
