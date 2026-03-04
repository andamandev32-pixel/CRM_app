
# Sales Pipeline & Budget Control Dashboard System  
## Software Requirement Specification (SRS)  
**Version 1.0 – Production Draft**

---

# 1. Introduction

## 1.1 Purpose

เอกสารฉบับนี้กำหนดขอบเขต ความต้องการ และโครงสร้างของระบบ  
**Sales Pipeline & Budget Control Dashboard System**

ระบบนี้ออกแบบเพื่อใช้ติดตามสถานะการนำเสนองานขายระบบ Digital Hospital Platform โดยเฉพาะกลุ่มโรงพยาบาลรัฐและสังกัดทหาร พร้อมรองรับการวิเคราะห์งบประมาณและความพร้อมในการปิดการขาย

---

# 2. System Overview

## 2.1 Product Groups

ระบบต้องรองรับการจำแนกตามกลุ่มผลิตภัณฑ์:

- MEDIQ Platform (Front Office)
- HIS (Clinical Core)
- ERP (Back Office)
- Custom & Special Solutions

---

# 3. Budget Readiness Model

| Code | Name | Description | Strategic Level |
|------|------|------------|----------------|
| B0 | Concept | ยังไม่มีงบ / แนวคิดเบื้องต้น | Cold |
| B1 | Planned | อยู่ในแผนของหน่วยงาน | Warm |
| B2 | Allocated | มีการตั้งงบไว้ | Hot |
| B3 | Approved | งบผ่านอนุมัติในปีงบ | Very Hot |
| B4 | Direct Purchase | มีเงินในมือ / จัดซื้อได้ทันที | Immediate |

---

# 4. Sales Stage Model (Military-Oriented)

| Code | Stage | Description |
|------|-------|------------|
| S0 | Target Identified | ระบุหน่วยงานเป้าหมาย |
| S1 | Initial Meeting | เข้าพบแนะนำ |
| S2 | Requirement Discussion | วิเคราะห์ความต้องการ |
| S3 | Demo / Workshop | สาธิตระบบ |
| S4 | TOR Drafting / Influence | มีบทบาทในการจัดทำ TOR |
| S5 | Proposal Submitted | ส่งข้อเสนอ |
| S6 | Negotiation | ต่อรองเงื่อนไข |
| S7 | Procurement Process | เข้าสู่กระบวนการจัดซื้อ |
| S8 | Closed Won | ชนะ |
| S9 | Closed Lost | แพ้ |

---

# 5. Forecast Model

Expected Revenue =  
Proposal Value × Stage Probability × Budget Weight

---

## Stage Probability

| Stage | Probability |
|--------|------------|
| S3 | 0.20 |
| S4 | 0.35 |
| S5 | 0.50 |
| S6 | 0.70 |
| S7 | 0.85 |
| S8 | 1.00 |

---

## Budget Weight

| Budget | Weight |
|---------|--------|
| B0 | 0.10 |
| B1 | 0.30 |
| B2 | 0.60 |
| B3 | 0.85 |
| B4 | 1.00 |

---

# 6. Data Model (Logical)

## sales_opportunity

- id (PK)
- hospital_name
- segment
- product_group
- budget_code (B0-B4)
- sales_stage (S0-S9)
- proposal_value
- expected_close_date
- owner
- procurement_type
- created_at
- updated_at

---

# End of SRS Version 1.0
