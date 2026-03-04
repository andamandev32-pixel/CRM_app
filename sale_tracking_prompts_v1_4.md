# Sale Tracking System — Prototype Prompts
## Google Apps Script + Google Sheets as Backend
### สำหรับใช้ใน Cursor / Windsurf / Anti-gravity IDE

**Version 1.4** | กุมภาพันธ์ 2568
**เพิ่มจาก v1.3:** Module 13 (Sales Pipeline & Budget Control Dashboard), อ้างอิง SRS v1.0 + Product Portfolio Digital Hospital Platform, อัปเดต SETUP Sheets (46 → 52 sheets)

---

## Changelog v1.3 → v1.4

| รายการ | รายละเอียด |
|---|---|
| เพิ่ม Module 13 | Sales Pipeline & Budget Control Dashboard — Budget Readiness Model (B0–B4), Sales Stage Model (S0–S9), Forecast Engine, Product Group Analysis, Budget Year Planning |
| เพิ่ม 6 Sheets ใหม่ | BudgetReadiness, SalesStageHistory, ForecastLogs, ProductGroupOpportunities, BudgetYearTargets, PipelineForecastCache |
| อัปเดต Module 4 | Pipeline Board รองรับ Budget Code (B0–B4) และ Stage Code (S0–S9) ตาม SRS |
| อัปเดต SETUP | เพิ่ม 6 Sheets ใหม่ (46 → 52 sheets) |
| อัปเดต FINAL | เพิ่ม page routes สำหรับ Module 13, Sidebar menu, runDailyAlerts() alerts ใหม่ |
| Product Portfolio | รองรับ 4 กลุ่มผลิตภัณฑ์: MEDIQ Platform / HIS / ERP / Custom & Special Solutions |
| Forecast Model | Expected Revenue = Proposal Value × Stage Probability × Budget Weight ตาม SRS |

---

## Changelog v1.2 → v1.3

| รายการ | รายละเอียด |
|---|---|
| เพิ่ม role ใหม่ | `pm` (Project Manager), `po` (Product Owner) แยกจาก `dev` |
| เพิ่ม Module 11 | Project Management — Project Board, Milestone Tracker, Issue & Risk Log, Delivery & Handover |
| เพิ่ม Module 12 | Product Owner Workspace — Dev Backlog, Feasibility Assessment, Requirement Clarification Thread, Release Notes |
| อัปเดต Module 6 | ManagerDashboard: Team Workload + Customer Assignment; ExecutiveDashboard: Win/Loss + Revenue Actual vs Target; Board: Strategic Account Review |
| อัปเดต SETUP | เพิ่ม 13 Sheets ใหม่ (33 → 46 sheets) |
| อัปเดต FINAL | เพิ่ม page routes, Sidebar ทุก role, initializeSheets, Alert ใหม่ |
| อัปเดต Notification | เพิ่ม alert types สำหรับ Module 11 และ 12 |

## Changelog v1.1 → v1.2

| รายการ | รายละเอียด |
|---|---|
| เพิ่ม Module 10 | Meeting Records & MOM — บันทึกการประชุมทุกประเภท, MOM + Action Items, ส่ง Email สรุปอัตโนมัติ |
| เพิ่ม Module 10 | Document Tracker — ติดตามสถานะ TOR/Quotation/TechSpec/MOU/Contract พร้อมวันครบกำหนด |
| เพิ่ม Module 10 | Customer Timeline — รวมกิจกรรม MOM และเอกสารในหน้าเดียว |
| อัปเดต SETUP | เพิ่ม 4 Sheets ใหม่ (29 → 33 sheets) |
| อัปเดต FINAL | เพิ่ม page routes และ sidebar menu สำหรับ Module 10 |
| อัปเดต Notification | เพิ่ม alert types สำหรับเอกสารเกินกำหนดและรอตอบกลับ |

## Changelog v1.0 → v1.1

| รายการ | รายละเอียด |
|---|---|
| เพิ่ม Module 8 | Sales Activity Planning & Calendar — Quota, Backward Planning, Calendar View, Pre-Visit Assessment, Plan vs Actual |
| เพิ่ม Module 9 | Dev Request & Strategic Pricing Approval — Dev Request Form, Dev Response, Strategic Pricing Detection, Board Approval Workflow, Cumulative Loss Tracking |
| อัปเดต SETUP | เพิ่ม 8 Sheets ใหม่ใน Google Sheets structure |
| อัปเดต FINAL | เพิ่ม page routes และ sidebar menu สำหรับ Module 8 และ 9 |
| อัปเดต Notification | เพิ่ม alert types สำหรับ Module 8 และ 9 |

---

## วิธีใช้ไฟล์นี้

1. เปิด IDE แล้วสร้างโปรเจกต์ใหม่
2. Copy prompt แต่ละโมดูลไปวางใน Chat / Composer ของ IDE
3. รัน Prompt ทีละโมดูลตามลำดับ เริ่มจาก SETUP ก่อนเสมอ
4. แต่ละโมดูลจะ generate ไฟล์ Code.gs และ HTML แยกกัน

---

## SETUP PROMPT (รันก่อนทุกอย่าง) — v1.4

```
You are building a Sale Tracking System prototype for a hospital IT sales team
selling HIS (Hospital Information System) and Queue Management systems.

Tech stack:
- Backend: Google Apps Script (GAS)
- Database: Google Sheets (one spreadsheet, multiple sheets as tables)
- Frontend: HTML Service (GAS doGet) with Bootstrap 5 CDN
- No external database, no npm, no node — pure GAS + HTML

User Roles (6 roles):
- sales       : พนักงานขาย — ใช้ Module 1–13
- manager     : Sales Manager — อนุมัติ + ดู Dashboard ทีม
- management  : Board / ผู้บริหาร — ดู Dashboard ระดับบริษัท + อนุมัติ Strategic
- po          : Product Owner — รับ Dev Request, ประเมิน Feasibility, จัดการ Backlog
- pm          : Project Manager — บริหาร Project หลัง PO Received, ติดตาม Milestone
- admin       : ตั้งค่าระบบ, จัดการสิทธิ์

Google Sheets structure — create the following sheets in one Spreadsheet:

CORE:
1.  Customers         — id, name, type(army/government/private/clinic), region, province, tier(T1/T2/T3/T4), status(active/prospect/inactive), assignedTo, createdAt
2.  Contacts          — id, customerId, name, position, phone, email
3.  Users             — id, name, email, role(sales/manager/management/po/pm/admin), region
4.  Notifications     — id, userId, type, message, link, isRead, createdAt

VISIT & ACTIVITY:
5.  VisitPlans        — id, month, year, salesId, status(draft/pending/approved/revision), approvedBy, approvedAt, totalBudget, note
6.  VisitPlanItems    — id, planId, customerId, visitDate, purpose, product(HIS/Queue/Other), estimatedCost
7.  VisitReports      — id, customerId, visitDate, attendees, products, objective, summary, interest(hot/warm/cold), createdBy, createdAt
8.  FollowUps         — id, reportId, customerId, action, deadline, assignedTo, status(pending/done/overdue)

PIPELINE & DEMO:
9.  Opportunities     — id, customerId, product, value, stage(S1/S2/S3/S4/S5/S6), probability, expectedClose, assignedTo, interest, stageHistory(JSON), createdAt
10. DemoRequests      — id, opportunityId, customerId, type(demo/trial), product, modules, startDate, endDate, status(draft/pending_l1/pending_l2/approved/rejected/revision), approvedBy1, approvedBy2, totalCost, attachments, createdBy, createdAt
11. DemoProgress      — id, demoId, round, reportDate, usageStatus, issues, resolution, satisfaction, nextAction, nextDeadline
12. DemoEvaluations   — id, demoId, overallResult, issues, feedback, suggestions, forecast, nextStep, closedBy, closedAt
13. DeviceHandovers   — id, demoId, type(handout/return), date, items(JSON), condition, signedBy

INSIGHTS:
14. CustomerInsights  — id, customerId, product, description, priority(high/medium/low), frequency, status(new/reviewing/in_dev/done), reviewedBy, devNote, createdBy, createdAt

ASSESSMENT & SEGMENTATION:
15. Segments          — id, name, type(master/custom), parentId, reviewInterval, assessmentTemplate, followUpRules(JSON), createdBy, createdAt
16. CustomerSegments  — id, customerId, segmentId, assignedBy, assignedAt
17. AssessmentScores  — id, customerId, date, source(visit/demo/trial/manual/auto), scores(JSON), totalScore, tier, triggeredBy, createdAt
18. TierMigrationLog  — id, customerId, fromTier, toTier, triggeredBy, confirmedBy, confirmedAt, note

SALES PLANNING & CALENDAR (Module 8):
19. SalesQuota        — id, salesId, period(YYYY-MM or YYYY-QN), targetValue, winRate, pipelineTarget, activityTargets(JSON), createdBy
20. ActivityPlans     — id, salesId, month, year, status(draft/active), createdAt
21. CalendarEvents    — id, salesId, customerId, type(visit/followup/demo/trial/adhoc), title, eventDate, startTime, endTime, purpose, isPlanned(true/false), status(planned/done/cancelled/rescheduled), linkedReportId, createdAt
22. PreVisitAssessments — id, eventId, customerId, objectives(JSON), expectedOutcomes, keyQuestions, documents(JSON), playbookNote, createdAt
23. PlanActualLog     — id, eventId, preAssessmentId, actualOutcomes, planMatch(full/partial/miss/exceed), scoreChange(JSON), pipelineCreated, isPlanned, note, createdAt

DEV REQUEST & PRICING (Module 9):
24. DevRequests       — id, opportunityId, customerId, requestType(estimate/comment/both/timeline), modules(JSON), specialRequirements, targetPrice, targetPriceReason, urgency(normal/urgent), deadline, attachments, status(draft/pending/responded/closed), createdBy, createdAt
25. DevResponses      — id, requestId, costBreakdown(JSON), totalCost, standardMargin, standardPrice, gap, gapPercent, technicalComment, timeline, respondedBy, respondedAt
26. StrategicPricings — id, requestId, salePrice, cost, gap, gapPercent, objectives(JSON), compensationPlan, hasCompensation(true/false), expectedPipeline(JSON), weightedPipeline, kpis(JSON), status(draft/pending_manager/pending_board/approved/rejected/conditional), createdBy, createdAt
27. StrategicApprovals — id, strategicId, level(manager/board), decision(approved/rejected/conditional/revision), conditions, note, approvedBy, approvedAt
28. StrategicKPILog   — id, strategicId, kpiIndex, targetDate, actualDate, result(met/not_met/partial), note, recordedBy, recordedAt
29. PricingPolicy     — id, maxLossPerProject, maxLossPerYear, levelThresholds(JSON), mandatoryConditions(JSON), minPipelineRatio, updatedBy, updatedAt

MEETING & DOCUMENT TRACKING (Module 10):
30. MeetingRecords    — id, opportunityId, customerId, type(VST/TEC/REQ/FUP/OTHER), meetingDate, startTime, endTime, location, isOnline(true/false), attendees(JSON), agenda(JSON), summary, progress(great/good/neutral/blocked), interest(hot/warm/cold), risks, linkedEventId, createdBy, createdAt
31. MeetingActionItems — id, meetingId, customerId, action, deadline, assignedTo, assignedSide(internal/customer), status(pending/done/overdue)
32. DocumentTrackers  — id, opportunityId, customerId, type(TOR/Quotation/TechSpec/MOU/Contract), status(not_started/drafting/internal_review/dev_review/legal_review/sent/customer_review/revision_required/resubmitted/negotiation/approved/signed/rejected), requiredDate, sentDate, customerResponseDate, assignedTo, version, attachments, linkedMeetingId, createdAt
33. DocumentStatusLog — id, documentId, fromStatus, toStatus, note, updatedBy, updatedAt

PROJECT MANAGEMENT (Module 11):
34. Projects          — id, opportunityId, customerId, name, product, contractValue, pmId, startDate, plannedEndDate, actualEndDate, status(planning/active/on_hold/delivered/closed), stage(planning/development/uat/training/golive/support), healthStatus(green/yellow/red), createdAt
35. Milestones        — id, projectId, name, description, plannedDate, actualDate, status(pending/in_progress/done/delayed/cancelled), assignedTo, note
36. ProjectIssues     — id, projectId, type(issue/risk), title, description, severity(high/medium/low), status(open/in_progress/resolved/closed), assignedTo, dueDate, resolution, createdBy, createdAt
37. DeliveryLogs      — id, projectId, type(partial/final/handover), deliveryDate, items(JSON), acceptedBy, signedDoc, note, createdBy
38. ProjectMeetings   — id, projectId, customerId, meetingDate, type(kickoff/progress/uat/training/golive/closeout), attendees(JSON), summary, actionItems(JSON), createdBy
39. CustomerAssignments — id, customerId, salesId, assignedBy, assignedAt, note

PRODUCT OWNER WORKSPACE (Module 12):
40. DevBacklog        — id, requestId, insightId, title, type(feature/bug/integration/custom_report/infra), priority(critical/high/medium/low), status(backlog/planned/in_sprint/done/rejected), sprintTarget, estimatedDays, poNote, assignedPO, createdAt
41. FeasibilityLogs   — id, requestId, backlogId, feasible(yes/no/conditional), effort(days), complexity(high/medium/low), risks, conditions, technicalNote, poId, createdAt
42. RequirementThreads — id, requestId, backlogId, messages(JSON array of {userId,role,text,timestamp}), status(open/resolved), createdAt
43. ReleaseNotes      — id, version, releaseDate, features(JSON), bugfixes(JSON), notes, notifyRoles(JSON), publishedBy, publishedAt
44. WinLossLog        — id, opportunityId, customerId, result(win/loss/no_decision), reason, competitorName, lostToPrice, lostToFeature, lostToRelation, salesId, closedAt, note
45. CoachingNotes     — id, salesId, managerId, note, actionItems(JSON), followUpDate, createdAt
46. TeamWorkload      — id, salesId, month, year, visitCount, followupCount, demoCount, trialCount, openOpportunities, calculatedAt

SALES PIPELINE & BUDGET CONTROL (Module 13):
47. BudgetReadiness      — id, opportunityId, budgetCode(B0/B1/B2/B3/B4), budgetYear(e.g. 2568), confirmedBy, confirmedAt, note, updatedBy, updatedAt
48. SalesStageHistory    — id, opportunityId, stageCode(S0–S9), enteredAt, exitedAt, daysInStage, exitReason, updatedBy
49. ForecastLogs         — id, opportunityId, forecastMonth, forecastYear, proposalValue, stageProbability, budgetWeight, expectedRevenue, calculatedAt, snapshot(JSON)
50. ProductGroupOpportunities — id, opportunityId, productGroup(MEDIQ/HIS/ERP/Custom), modules(JSON), estimatedValue, isLead(true/false), note
51. BudgetYearTargets    — id, salesId, budgetYear, targetValue, productGroup, segment(army/government/private), createdBy, createdAt
52. PipelineForecastCache — id, cacheKey, period, filters(JSON), result(JSON), calculatedAt

Create a file named Code.gs with:
- SpreadsheetApp.openById(SPREADSHEET_ID) as the main DB connection
- A CONFIG object at the top:
  SPREADSHEET_ID = "" (to be filled by user)
  VERSION = "1.4"
  APP_NAME = "Sale Tracking System"
- Helper functions: getSheet(name), generateId(), getCurrentUser(), formatDate(), formatCurrency()
- A doGet(e) router that reads e.parameter.page and returns the correct HTML page
- Role-based page access control: each page checks getCurrentUser().role before rendering

Name all functions clearly, e.g. getCustomers(), createVisitReport(), approveDemoRequest()
Use JSON.stringify for returning data from GAS to HTML via google.script.run
```

---

## MODULE 1 — Customer Management

```
Build Module 1: Customer Management for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:
- getCustomers(filters)          — return all customers, support filter by type/region/tier/status
- getCustomerById(id)            — return customer + contacts + recent activities summary
- createCustomer(data)           — insert new row in Customers sheet, auto-generate id
- updateCustomer(id, data)       — update row in Customers sheet
- getContactsByCustomer(id)      — return rows from Contacts sheet where customerId = id
- createContact(data)            — insert new row in Contacts sheet
- getCustomerActivitySummary(id) — return last 5 VisitReports + active FollowUps + Pipeline stage + latest AssessmentScore for this customer

Frontend — create CustomerList.html:
- Top bar: search input (searches name/province), filter dropdowns for type/region/tier/status
- Table with columns: #, ชื่อหน่วยงาน, ประเภท, Tier (badge with color: T1=red/T2=yellow/T3=green/T4=gray), ภูมิภาค, สถานะ, Assessment Score, Action [ดู]
- "+ เพิ่มลูกค้าใหม่" button opens a modal form

Modal form fields:
- ชื่อหน่วยงาน (text, required)
- ประเภท (select: กองทัพบก / รัฐ / เอกชน / คลินิก)
- ภูมิภาค (select: กลาง / เหนือ / อีสาน / ใต้)
- จังหวัด (text)
- Tier (select: T1 / T2 / T3 / T4)
- สถานะ (select: Active / Prospect / Inactive)
- หมายเหตุ (textarea)

Frontend — create CustomerProfile.html:
- Header: ชื่อหน่วยงาน, badge ประเภท, badge Tier, badge สถานะ, [แก้ไข] button
- Info section: ประเภท / ภูมิภาค / จังหวัด / Tier / สถานะ / พนักงานขาย
- Tabs: [ข้อมูลหน่วยงาน] [ผู้ติดต่อ] [ประวัติกิจกรรม] [Pipeline] [Assessment]
- ผู้ติดต่อ tab: table of contacts + "+ เพิ่มผู้ติดต่อ" button
- ประวัติกิจกรรม tab: timeline list of VisitReports sorted by date desc
- Pipeline tab: show active Opportunities for this customer with Stage badge
- Assessment tab: show latest score panel with 5 dimension bars, tier badge, trend arrows, next review date, [ทบทวนด่วน] and [Full Review] buttons

Use Bootstrap 5 for all UI. Thai language for all labels.
Call GAS backend via google.script.run.withSuccessHandler().functionName()
```

---

## MODULE 2 — Visit & Activity Management

```
Build Module 2: Visit & Activity Management for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:
- getVisitPlans(salesId, month, year)        — return plans filtered by user/period
- createVisitPlan(data)                       — insert VisitPlans + VisitPlanItems rows
- updateVisitPlanStatus(planId, status, note) — update status field, record approver
- getVisitPlanById(planId)                    — return plan + items
- createVisitReport(data)                     — insert VisitReports row + auto-create FollowUp rows + trigger Assessment Quick Update prompt flag
- getVisitReports(filters)                    — return reports filtered by customerId/salesId/dateRange
- getFollowUps(userId)                        — return FollowUps assigned to user, sorted by deadline
- updateFollowUpStatus(id, status)            — mark follow-up as done
- checkOverdueFollowUps()                     — scheduled trigger: set status=overdue where deadline < today

Frontend — create VisitPlanForm.html:
- Header: "แผนการเข้าพบ — [เดือน/ปี]", status badge, assigned sales name
- Dynamic table to add visit items:
  - Each row: ลูกค้า (searchable dropdown from Customers), วันที่, วัตถุประสงค์, สินค้า (HIS/Queue/Other), ค่าใช้จ่าย
  - "+ เพิ่มรายการ" button adds new row
  - Total budget auto-sum at bottom
- Note textarea
- Buttons: [บันทึก Draft] [ส่งขออนุมัติ ▶]

Frontend — create VisitReportForm.html:
- ลูกค้า (searchable dropdown), วันที่/เวลาเริ่ม–สิ้นสุด
- ผู้เข้าร่วม (text, comma separated)
- สินค้าที่นำเสนอ (checkboxes: HIS / Queue / Other)
- วัตถุประสงค์ (textarea)
- สรุปสาระสำคัญ (textarea)
- ระดับความสนใจ (radio: Hot🔴 / Warm🟡 / Cold🔵)
- Next Action section: dynamic table with columns [Action, Deadline, ผู้รับผิดชอบ, + เพิ่ม]
- After save: show Assessment Quick Update modal (see Module 1C) with pre-filled customer data
- Button: [บันทึก ▶]

Frontend — create FollowUpDashboard.html:
- Section 🔴 เกินกำหนด: list with customer name, action, deadline, [ทำแล้ว] button
- Section 🟡 วันนี้/พรุ่งนี้: same format
- Section 🟢 สัปดาห์นี้: same format
- Each item shows customer name, action text, days overdue/remaining

Frontend — create ApprovalInbox.html (for U02 Sales Manager):
- Tabs: [แผนการเข้าพบ] [Demo/Trial] [Strategic Pricing]
- แผนการเข้าพบ tab: list of pending Visit Plans — sales name, month/year, number of visits, estimated budget, [อนุมัติ] [ส่งกลับ] buttons
- Modal for revision note when sending back

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
```

---

## MODULE 3 — Demo & Trial Management

```
Build Module 3: Demo & Trial Management for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:
- createDemoRequest(data)              — insert DemoRequests row, validate Pre-condition for trial type
- getDemoRequests(filters)             — return requests filtered by type/status/customerId/salesId
- getDemoRequestById(id)               — return full request + progress reports + evaluation
- validateTrialPrecondition(opportunityId) — check Stage >= S3 AND has attachment
- approveDemoRequest(id, level, decision, note) — update status by approval level
  - level 1 (manager): pending_l1 → approved (demo) or pending_l2 (trial) or rejected/revision
  - level 2 (management): pending_l2 → approved or rejected
- createDemoProgress(data)             — insert DemoProgress row
- getDemoProgressByDemoId(demoId)      — return all progress reports for a demo
- createDemoEvaluation(data)           — insert DemoEvaluations row, trigger Pipeline update
- createDeviceHandover(data)           — insert DeviceHandovers row
- checkTrialAlerts()                   — scheduled trigger: check 7-day warning, overdue progress

Frontend — create DemoRequestForm.html:
- Toggle at top: [Demo] / [Trial] — changes form fields and approval note
- Common fields: ลูกค้า (dropdown), สถานที่, สินค้า (radio: HIS/Queue), โมดูล (checkboxes), เวอร์ชัน
- Demo-only fields: วันที่สาธิต (date+time range), อุปกรณ์ที่นำไป (checkboxes), Demo Data type (radio)
- Trial-only fields:
  - ผู้รับผิดชอบลูกค้า + โทรศัพท์
  - Infrastructure requirements (textarea)
  - Device table: [รายการ | Serial No. | + เพิ่ม]
  - Cost breakdown: Hardware / Temp License / ค่าแรง / ค่าเดินทาง / รวม (auto-sum)
  - วันเริ่ม–สิ้นสุด Trial
  - Attachment upload (base64 to sheet): checkboxes Demo Result / MOU / LOI
- Buttons: [บันทึก Draft] [ส่งขออนุมัติ ▶]

Frontend — create DemoProgressForm.html:
- Header: show demo/trial info (customer, product, period, round number auto-calculated)
- สถานะการใช้งาน (radio: ใช้งานปกติ / บางส่วน / หยุดใช้งาน)
- ปัญหาที่พบ + การแก้ไข (side-by-side textareas)
- ระดับความพึงพอใจ (radio: ดีมาก / ดี / พอใช้ / ต้องปรับ)
- Next Action + Deadline
- Button: [บันทึก ▶]

Frontend — create DemoEvaluationForm.html:
- ผลการใช้งานโดยรวม (textarea)
- ปัญหาและการแก้ไขตลอด Trial (textarea)
- Feedback จากผู้ใช้งาน (textarea)
- ข้อเสนอแนะ (textarea)
- Forecast มูลค่าปิดการขาย (number input)
- Next Step (radio: ปิดการขาย / ขยาย Trial / ยุติ)
- If ยุติ: show Device Return section (Device Handover form inline)
- Button: [บันทึก ▶]

Frontend — create DemoApprovalInbox.html (for U02 + U03):
- Tabs: [รออนุมัติ] [อนุมัติแล้ว] [ปฏิเสธ]
- Each item: type badge (DEMO/TRIAL), customer name, product, cost, requester, date, [ดูรายละเอียด] [อนุมัติ] [ส่งกลับ] [ปฏิเสธ]
- Modal for decision with note textarea

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
```

---

## MODULE 4 — Sales Pipeline Management

```
Build Module 4: Sales Pipeline Management for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:
- getOpportunities(filters)           — return opportunities filtered by stage/product/region/salesId/dateRange
- getOpportunityById(id)              — return opportunity + stage history log + linked activities
- createOpportunity(data)             — insert Opportunities row
- updateOpportunityStage(id, newStage, reason) — update stage, append to stageHistory JSON
- updateOpportunity(id, data)         — update value/probability/expectedClose/interest
- getPipelineSummary(filters)         — return count+value grouped by stage for dashboard
- getForecast(month, year)            — return sum of value * probability for expectedClose in that month

Frontend — create PipelineBoard.html:
- Filter bar: สินค้า (HIS/Queue/All), ภูมิภาค, พนักงานขาย, ช่วงเวลาปิด
- Kanban-style board: 6 columns for S1–S6
- Each column header: stage name, count badge, total value in million baht
- Each card: customer name, product badge, value, interest badge (Hot🔴/Warm🟡/Cold🔵)
- Click card → opens OpportunityDetail panel
- "+ สร้าง Opportunity" button

Frontend — create OpportunityDetail.html (modal or side panel):
- Header: customer name — product, [แก้ไข] button
- Stage progress bar: S1 → S2 → S3 → S4 → S5 → S6 with current highlighted
- Info: มูลค่า, ความน่าจะเป็น %, วันที่คาดว่าจะปิด, พนักงานขาย, ระดับความสนใจ
- Tabs: [ข้อมูล] [ประวัติ Stage] [กิจกรรม] [Demo/Trial] [Dev Request]
- Dev Request tab: linked DevRequests for this opportunity with status badges
- Action buttons: [เปลี่ยน Stage ▶] [สร้าง Demo] [สร้าง Trial] [สร้าง Dev Request]

Frontend — create OpportunityForm.html (create/edit):
- ลูกค้า (searchable dropdown)
- ผลิตภัณฑ์ (radio: HIS / ระบบคิว / อื่นๆ)
- มูลค่าที่คาดการณ์ (number)
- Stage เริ่มต้น (select S1–S3 only for new)
- ความน่าจะเป็น % (number 0–100)
- วันที่คาดว่าจะปิด (date)
- ระดับความสนใจ (select: Hot / Warm / Cold)
- Button: [บันทึก ▶]

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
```

---

## MODULE 5 — Customer Insight & Development Handoff

```
Build Module 5: Customer Insight & Development Handoff for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:
- getCustomerInsights(filters)          — return insights filtered by product/priority/status
- createCustomerInsight(data)           — insert CustomerInsights row
- updateInsightStatus(id, status, note) — update status, record reviewer/devNote
- getInsightSummary()                   — return count grouped by priority and status

Frontend — create InsightList.html:
- Header: "Customer Insight" + "+ บันทึกใหม่" button
- Filter bar: สินค้า, ความเร่งด่วน, สถานะ
- Grouped list: 🔴 High / 🟡 Medium / 🟢 Low
- Each card: Insight ID, สินค้า badge, คำอธิบาย, พบใน X หน่วยงาน, สถานะ badge, [ดูรายละเอียด]

Frontend — create InsightForm.html (modal):
- ลูกค้าที่พบความต้องการนี้ (multi-select dropdown)
- สินค้าที่เกี่ยวข้อง (radio: HIS / Queue / Other)
- คำอธิบายความต้องการ (textarea, required)
- ระดับความเร่งด่วน (radio: สูง🔴 / กลาง🟡 / ต่ำ🟢)
- จำนวนหน่วยงานที่ต้องการเหมือนกัน (number)
- Button: [บันทึก ▶]

Frontend — create InsightDetail.html (modal):
- Show all insight fields
- For U02: [ส่งต่อ Development] button → status = reviewing, notify U04
- For U04: status dropdown + devNote textarea + [อัปเดตสถานะ] button
- ประวัติสถานะ: timeline of changes

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
```

---

## MODULE 6 — Dashboard & Reporting

```
Build Module 6: Dashboard & Reporting for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:
- getExecutiveDashboard()       — return pipeline summary, forecast, closed this month, top opportunities, active demo/trials, strategic pricing summary, win/loss summary, revenue actual vs target, T1 accounts
- getSalesDashboard(salesId)    — return follow-up summary, my pipeline, demo/trial count, visit plan this month, quota progress
- getManagerDashboard()         — return team pipeline by person, pending approvals count, conversion rates, team workload, coaching notes
- getRevenueActualVsTarget(year) — return monthly actual (closed won) vs quota target for chart
- exportReport(type, filters)   — return data array for export

Frontend — create ExecutiveDashboard.html:
- Top row: KPI cards (Pipeline รวม, Forecast Q, ปิดแล้วเดือนนี้, Win Rate %)
- Revenue Actual vs Target [NEW v1.3]:
  - Bar chart: Target vs Actual revenue by month (Chart.js)
  - YTD summary: ทำได้ X / เป้า Y / Gap Z% badge (green/red)
- Pipeline by Stage: horizontal bar chart (Chart.js)
- Win/Loss Summary [NEW v1.3]:
  - Win Rate % + Loss Reasons top 3 from WinLossLog
  - [ดูวิเคราะห์ ▶] → WinLossAnalysis.html
- Strategic Account Review [NEW v1.3]:
  - T1 Accounts table: ชื่อหน่วยงาน / Assessment Score / Pipeline Stage / Next Action / วัน Review ถัดไป
- Active Demo/Trial table with days-remaining warning (red if ≤ 7 days)
- Top Opportunities table
- Strategic Pricing summary card: ยอดสะสม YTD / กรอบ / คงเหลือ [ดูรายละเอียด]
- Export: [PDF] [Excel]

Frontend — create MyDashboard.html (for sales):
- KPI cards: Follow-up ค้าง, Pipeline ของฉัน, Demo/Trial ที่ดำเนินอยู่, Quota Progress %
- Follow-up section by urgency
- แผนการเข้าพบเดือนนี้ with status icons
- Quick link: [ดูปฏิทิน ▶] → Calendar page (Module 8)

Frontend — create ManagerDashboard.html (for manager):
- Team Pipeline table by salesperson
- Team Workload panel [NEW v1.3]:
  - Table: พนักงานขาย / Opportunity เปิด / กิจกรรมเดือนนี้ / สถานะ (ปกติ🟢/หนัก🔴/ว่าง🟡)
  - [มอบหมายลูกค้า ▶] button per row → CustomerAssignmentView
- Pending Approvals: แผนการเข้าพบ / Demo/Trial / Strategic Pricing (count badges + [ไปที่ Inbox])
- Win/Loss this month: Win Rate + top loss reason
- Coaching Notes panel [NEW v1.3]:
  - List: พนักงานขาย / บันทึกล่าสุด / วันติดตาม / [บันทึกใหม่ ▶]
- Conversion Rate table: S1→S2 / S2→S3 ... with % rate

Frontend — create PMDashboard.html (for pm) [NEW v1.3]:
- KPI cards: โครงการที่ดูแล / Milestone เกินกำหนด / Issue สูง เปิดอยู่ / โครงการ 🔴
- My Projects list: health badge, ลูกค้า, stage, next milestone + วันคงเหลือ

Frontend — create PODashboard.html (for po) [NEW v1.3]:
- KPI cards: รอ Feasibility / อยู่ใน Sprint / Requirement Thread เปิด / Release เดือนนี้
- Incoming Requests: DevRequests responded + not yet in backlog

Use Chart.js CDN, Bootstrap 5, Thai labels, google.script.run.
```

---

## MODULE 7 — Notification & Alert System

```
Build Module 7: Notification & Alert System for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.

Backend functions to add in Code.gs:

Real-time notifications:
- createNotification(userId, type, message, link) — insert row in Notifications sheet
- getUnreadNotifications(userId)                   — return unread rows for user
- markNotificationRead(id)                         — update isRead = true
- markAllRead(userId)                              — update all isRead = true for user

Scheduled triggers (daily 8:00 AM via GAS time-driven trigger):
- runDailyAlerts() — master function calling all checks:

  checkOverdueFollowUps()
    — FollowUps where status=pending AND deadline < today → set overdue
    — notify assignedTo (ALT-VIS-02), if >3 days also notify manager (ALT-VIS-03)

  checkTrialProgressDue()
    — active Trials where progress report is due and not submitted
    — notify sales (ALT-DEM-04), if 1 day overdue also notify manager (ALT-DEM-05)

  checkTrialEndingSoon()
    — DemoRequests where endDate = today + 7 → notify sales + manager (ALT-DEM-06)

  checkTrialEndedNoEval()
    — DemoRequests where endDate < today AND no DemoEvaluation → notify (ALT-DEM-07)

  checkInsightsPendingReview()
    — CustomerInsights where status=new AND createdAt < today-3 → notify manager (ALT-INS-01)

  checkActivityPlanProgress()       [NEW v1.1]
    — SalesQuota where current date is week 3+ of month
    — compare CalendarEvents done vs ActivityTargets
    — if visit completion < 50% by mid-month → notify sales + manager (ALT-CAL-01)

  checkPreVisitAssessmentDue()      [NEW v1.1]
    — CalendarEvents where eventDate = tomorrow AND no PreVisitAssessment linked
    — notify sales to complete pre-visit assessment (ALT-CAL-02)

  checkDevRequestOverdue()          [NEW v1.1]
    — DevRequests where status=pending AND deadline < today
    — notify dev team + requester (ALT-DEV-01)

  checkStrategicKPIDue()            [NEW v1.1]
    — StrategicKPILog where targetDate < today AND result is null
    — notify sales + manager to update KPI result (ALT-STR-01)

  checkStrategicBudgetWarning()     [NEW v1.1]
    — sum approved StrategicPricings YTD
    — if cumulative loss > 80% of maxLossPerYear → notify management (ALT-STR-02)

  checkDocumentDeadlines()          [NEW v1.2]
    — DocumentTrackers where requiredDate = today+3 AND status NOT IN (approved/signed/rejected)
    — notify assignedTo (ALT-DOC-01)
    — if requiredDate < today: notify assignedTo + manager (ALT-DOC-02)

  checkDocumentAwaitingResponse()   [NEW v1.2]
    — DocumentTrackers where status=sent AND sentDate < today-5 AND customerResponseDate is null
    — notify assignedTo to follow up (ALT-DOC-03)

  checkMeetingActionItemsDue()      [NEW v1.2]
    — MeetingActionItems where assignedSide=internal AND status=pending AND deadline = tomorrow
    — notify assignedTo (ALT-MTG-01)
    — if deadline < today: notify assignedTo + manager (ALT-MTG-02)

  checkMilestoneDeadlines()         [NEW v1.3]
    — Milestones where plannedDate = today+3 AND status NOT IN (done/cancelled)
    — notify assignedTo + pm (ALT-PRJ-01)
    — if plannedDate < today AND status != done: notify pm + manager (ALT-PRJ-02)
    — call recalculateProjectHealth() for affected projects

  checkOpenHighIssues()             [NEW v1.3]
    — ProjectIssues where severity=high AND status=open AND createdAt < today-2
    — notify pm + manager (ALT-PRJ-03)

  checkDevRequestFeasibilityDue()   [NEW v1.3]
    — DevRequests where status=responded AND no FeasibilityLog AND respondedAt < today-3
    — notify po (ALT-PO-01)

  checkRequirementThreadsIdle()     [NEW v1.3]
    — RequirementThreads where status=open AND last message > 5 days ago
    — notify both sales and po (ALT-PO-02)

  checkReleaseNoteUnread()          [NEW v1.3]
    — ReleaseNotes where publishedAt = yesterday AND notifyRoles includes user's role
    — notify relevant users to review release note (ALT-PO-03)

Setup: setupTriggers() using ScriptApp.newTrigger('runDailyAlerts').timeBased().everyDays(1).atHour(8).create()

Frontend — create NotificationBell.html (component):
- Bell icon 🔔 with unread count badge
- Dropdown: latest 10 notifications with icon, message, time ago
- [ทำเครื่องหมายอ่านทั้งหมด] button
- Auto-refresh every 60 seconds

Frontend — create NotificationList.html (full page):
- Filter: [ทั้งหมด] [ยังไม่ได้อ่าน] [อ่านแล้ว]
- Grouped by date

Notification type icons (updated v1.1):
- follow_up_overdue      → ⏰
- approval_result        → ✅ or ❌
- trial_progress_due     → 📋
- trial_ending_soon      → ⚠️
- insight_pending        → 💡
- dev_update             → 🔧
- activity_plan_behind   → 📅  [NEW]
- pre_visit_due          → 🎯  [NEW]
- dev_request_overdue    → 🛠️  [NEW]
- strategic_kpi_due      → 📊  [NEW v1.1]
- strategic_budget_warn  → 🚨  [NEW v1.1]
- doc_deadline_soon      → 📄  [NEW v1.2]
- doc_overdue            → 🔴  [NEW v1.2]
- doc_awaiting_response  → 📬  [NEW v1.2]
- meeting_action_due     → ✍️  [NEW v1.2]
- meeting_action_overdue → ⚠️  [NEW v1.2]
- milestone_due          → 🏁  [NEW v1.3]
- milestone_overdue      → 🔴  [NEW v1.3]
- high_issue_open        → 🚨  [NEW v1.3]
- feasibility_due        → 🔍  [NEW v1.3]
- thread_idle            → 💬  [NEW v1.3]
- release_note_published → 🚀  [NEW v1.3]

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
```

---

## MODULE 8 — Sales Activity Planning & Calendar

```
Build Module 8: Sales Activity Planning & Calendar for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.
New sheets used: SalesQuota, ActivityPlans, CalendarEvents, PreVisitAssessments, PlanActualLog

Backend functions to add in Code.gs:

Quota & Planning:
- getSalesQuota(salesId, period)      — return quota + activityTargets for a period
- setSalesQuota(data)                 — insert or update SalesQuota row (manager only)
- calculateBackwardPlan(salesId, period) — compute required pipeline, opportunities, activities from quota and historical winRate
- getActivityPlanProgress(salesId, month, year) — return planned vs actual counts per activity type

Calendar:
- getCalendarEvents(salesId, month, year) — return all events for month, sorted by date
- createCalendarEvent(data)           — insert CalendarEvent row
- updateCalendarEvent(id, data)       — update event details or status
- linkEventToReport(eventId, reportId) — update CalendarEvent.linkedReportId after Visit Report saved

Pre-Visit Assessment:
- createPreVisitAssessment(data)      — insert PreVisitAssessments row linked to eventId
- getPreVisitAssessment(eventId)      — return assessment for an event
- getCustomerContextForVisit(customerId) — return latest AssessmentScore + last VisitReport + active FollowUps + Pipeline stage + Budget info for pre-visit briefing

Plan vs Actual:
- createPlanActualLog(data)           — insert PlanActualLog row after Visit Report is filed
- getPlanActualSummary(salesId, month, year) — return summary: planned/actual/adhoc counts, pipeline created by type, pre-assessment accuracy rate

Frontend — create ActivityPlanDashboard.html:
- Top section: Quota & Backward Planning panel
  - Target value, Win Rate, required Pipeline, required Opportunities
  - Activity targets per month: Visit / Follow-up / Demo / Trial (editable by manager)
  - Progress bars: actual vs target for each activity type, color-coded (green ≥ 80% / yellow 50-79% / red < 50%)
- Bottom section: quick summary for current month
  - Cards: ตามแผน / นอกแผน / ยกเลิก / เกินกำหนด
  - [ดูปฏิทิน ▶] button

Frontend — create CalendarView.html:
- View switcher: [เดือน] [สัปดาห์] [วัน]
- Month view:
  - Grid calendar with Thai month/year header, ◀ ▶ navigation
  - Each day cell shows colored event pills (max 3 visible, +N more)
  - Event color coding:
    🟦 Planned Visit/Demo    🟩 Planned Follow-up
    ✅ Done (any type)       🟧 Ad-hoc (isPlanned=false)
    🟥 Overdue/Cancelled     🟡 Trial in Progress
  - Click day → shows day detail panel or switches to Day view
- Week view:
  - 5-column grid (Mon–Fri), time slots 08:00–18:00
  - Each event as a block with customer name + type icon
  - Shows daily target summary: e.g. "Visit: 1/2 ✓ | Follow-up: 2/3"
- Day view:
  - Time-ordered list of events for that day
  - Each event: time, customer, type badge, [ประเมินก่อนไป ▶] or [บันทึกผล ▶] button depending on status
- "+ เพิ่มกิจกรรม" FAB button → opens EventForm modal

Frontend — create EventForm.html (modal):
- ประเภท (select: Visit นำเสนอ / Follow-up / Demo / Trial / นอกแผน)
- ลูกค้า (searchable dropdown)
- วันที่ + เวลาเริ่ม–สิ้นสุด
- วัตถุประสงค์ (textarea)
- สินค้าที่จะนำเสนอ (checkboxes)
- isPlanned toggle (auto-set based on type — Ad-hoc sets false)
- Button: [บันทึก ▶]

Frontend — create PreVisitAssessmentForm.html:
- Header: customer name, event date/time, event purpose
- Panel 1 — สถานะปัจจุบันของลูกค้า (auto-loaded, read-only):
  - Assessment Score + Tier badge
  - Pipeline Stage
  - วันที่พบล่าสุด (X วันที่แล้ว)
  - Budget status (from latest AssessmentScore)
  - Special Requirements flags
- Panel 2 — เป้าหมายการเข้าพบครั้งนี้ (editable):
  - วัตถุประสงค์หลัก (checkboxes: นำเสนอ / ติดตาม Budget / หา Champion / นำเสนอ Demo / ติดตาม TOR / อื่นๆ)
  - ผลที่คาดหวัง (radio: ได้นัด Demo / ได้ข้อมูล Budget / ได้ TOR / อื่นๆ)
  - ประเด็นสำคัญที่จะถาม (textarea with "+ เพิ่มประเด็น" dynamic list)
- Panel 3 — Playbook แนะนำ (auto-generated from Assessment scores):
  - Show 2–4 contextual tips based on low-scoring dimensions and last visit gap
  - เอกสารที่ควรเตรียม (checkboxes: Brochure / Case Study / ใบเสนอราคา / TOR / อื่นๆ)
- Button: [บันทึก Pre-Assessment ▶]

Frontend — create PlanActualReport.html:
- Monthly summary table: ประเภท | แผน | จริง | %
- Rows: Visit / Follow-up / Demo / Trial / รวม
- Split: ตามแผน vs นอกแผน (Ad-hoc) — count and pipeline value created
- Pre-Assessment Accuracy section:
  - ผลตรงตามที่ประเมิน / เกินคาด / ต่ำกว่าคาด (count + %)
  - Bar chart (Chart.js) showing accuracy trend over last 3 months
- Export: [Excel ▶]

Use Bootstrap 5, Chart.js CDN, Thai labels, google.script.run for all data calls.
```

---

## MODULE 9 — Dev Request & Strategic Pricing Approval

```
Build Module 9: Dev Request & Strategic Pricing Approval for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.
New sheets used: DevRequests, DevResponses, StrategicPricings, StrategicApprovals, StrategicKPILog, PricingPolicy

Backend functions to add in Code.gs:

Dev Request:
- createDevRequest(data)              — insert DevRequests row linked to opportunityId
- getDevRequests(filters)             — return requests filtered by status/salesId/customerId
- getDevRequestById(id)               — return request + response if exists
- updateDevRequestStatus(id, status)  — update status field
- createDevResponse(data)             — insert DevResponses row, auto-calculate gap and gapPercent, trigger strategic pricing check
- detectStrategicPricing(requestId)   — compare salePrice vs totalCost, return true if salePrice < totalCost

Strategic Pricing:
- createStrategicPricing(data)        — insert StrategicPricings row
- getStrategicPricingById(id)         — return full record + approvals + KPI logs
- submitStrategicForApproval(id)      — change status to pending_manager, notify manager
- approveStrategicPricing(id, level, decision, conditions, note) — insert StrategicApprovals row, update status
  - level=manager: if approved AND gap > manager threshold → escalate to board (pending_board), else final approved
  - level=board: final decision
- getStrategicPricingSummary(year)    — return YTD cumulative loss, count, list, remaining budget
- getPricingPolicy()                  — return current policy settings
- updatePricingPolicy(data)           — update PricingPolicy (admin only)
- createStrategicKPILog(data)         — insert KPI result record
- getStrategicKPILogs(strategicId)    — return all KPI logs for a strategic pricing record

Frontend — create DevRequestForm.html:
- Link to Opportunity (searchable dropdown showing customer + product + stage)
- ประเภทคำขอ (checkboxes: ประเมินราคา / Comment ทางเทคนิค / แผนงาน Timeline)
- โมดูลที่ต้องการ (checkboxes: OPD / IPD / ER / LAB / Pharmacy / Billing / Radiology / Custom)
- ความต้องการพิเศษ (dynamic list: "+ เพิ่มรายการ" with description field each)
- ราคาขายเป้าหมาย (number) + วงเงินที่ลูกค้าบอก (number)
- เหตุผลการกำหนดราคา (radio: ตามงบลูกค้า / แข่งขันตลาด / กลยุทธ์ / อื่นๆ)
- ความเร่งด่วน (radio: ปกติ 14 วัน / เร่งด่วน 7 วัน) + Deadline (auto-calculated, editable)
- เอกสารแนบ (base64 file upload: TOR / Visit Report / Assessment)
- Buttons: [บันทึก Draft] [ส่งถึง Dev ▶]

Frontend — create DevResponseForm.html (for U04 Dev role):
- Header: show request details (customer, modules, special requirements, target price)
- Cost breakdown table (dynamic rows):
  - Categories: License / Custom Development (with sub-items) / Implementation / Hardware / Support Y1
  - Each row: รายการ, มูลค่า (บาท), หมายเหตุ
  - Auto-sum to ต้นทุนรวม
  - Standard Margin % (default 20%, editable) → auto-calculate ราคาขายมาตรฐาน
- Gap calculation (auto): show ราคาขายเป้าหมาย vs ต้นทุน vs ราคามาตรฐาน
  - If salePrice < totalCost: show red warning banner "⚠ ราคาขายต่ำกว่าต้นทุน — จะเข้าสู่ Strategic Pricing Flow"
- Technical Comment (textarea)
- Timeline estimate (text: X–Y months, Go-live date)
- Button: [ส่ง Response ▶]

Frontend — create StrategicPricingForm.html (auto-opens after DevResponse saved if gap detected):
- Header: warning banner with gap amount and percent
- Financial summary panel (read-only, from DevResponse):
  - ราคาขาย / ต้นทุน / ขาดทุนครั้งนี้ / ยอดสะสม YTD / กรอบ YTD / คงเหลือ
  - Progress bar showing YTD usage vs annual limit
- วัตถุประสงค์เชิงกลยุทธ์ (checkboxes: เปิดตลาดใหม่ / ป้องกัน Account / สร้าง Reference Site / Pilot คาดขยายต่อ / เงื่อนไขพิเศษ / อื่นๆ)
- แผนชดเชยผลขาดทุน:
  - radio: มีแผนชดเชยชัดเจน / ไม่มีแต่มีผลเชิงกลยุทธ์ / อยู่ระหว่างเจรจา
  - textarea: รายละเอียด
  - If "ไม่มีแผนชดเชย": show yellow warning "กรณีนี้ต้องระบุผลประโยชน์เชิงกลยุทธ์ให้ชัดเจน และ Board จะพิจารณาเข้มงวดขึ้น"
- Pipeline ที่คาดว่าจะได้ (dynamic table: ลูกค้าที่คาดหวัง / มูลค่าประมาณ / โอกาส % / Weighted Value auto-calc)
  - Auto-sum Weighted Pipeline total
  - Show ratio: Weighted Pipeline / Loss amount (flag if < policy minPipelineRatio)
- KPI ที่ต้องติดตาม (dynamic checklist with target date for each KPI)
- Buttons: [บันทึก Draft] [ส่ง Manager อนุมัติ ▶]

Frontend — create StrategicApprovalView.html (for U02 Manager + U03 Board):
- Summary card: โครงการ / ราคาขาย / ต้นทุน / ขาดทุน / ยอดสะสม YTD / กรอบคงเหลือ
- Strategy section: objectives, compensation plan, expected pipeline table, weighted total, ratio badge
- Technical risks from DevResponse
- KPI list with target dates
- Attached documents links
- Approval level indicator: "ระดับปัจจุบัน: Manager" or "ระดับปัจจุบัน: Board"
- Decision form:
  - radio: อนุมัติ / อนุมัติมีเงื่อนไข / ส่งกลับแก้ไข / ไม่อนุมัติ
  - If อนุมัติมีเงื่อนไข: textarea for conditions
  - If ส่งกลับ/ไม่อนุมัติ: textarea for reason (required)
- Button: [บันทึกผลการอนุมัติ ▶]

Frontend — create StrategicPricingDashboard.html (for U03 Management):
- Policy summary: กรอบ/โครงการ / กรอบ/ปี / ระดับอนุมัติ
- YTD progress bar: ยอดสะสมขาดทุน vs กรอบประจำปี (color: green < 60% / yellow 60-80% / red > 80%)
- Table: รายการโครงการ Strategic Pricing ทั้งหมด
  - Columns: #, โครงการ, ราคาขาย, ต้นทุน, ขาดทุน, วัตถุประสงค์, สถานะ, Action
  - Status badges: Draft / รอ Manager / รอ Board / อนุมัติ✅ / ปฏิเสธ❌ / มีเงื่อนไข⚠
- KPI Tracking section:
  - List of approved projects with KPI checkboxes and due dates
  - Each KPI row: description, target date, status (pending/met/not_met/partial), [บันทึกผล] button
- Weighted Pipeline vs Loss Ratio chart (Chart.js bar chart): per project
- Export: [Excel ▶]

Frontend — create PolicySettings.html (for Admin):
- กรอบยอดขาดทุน: รายโครงการ (number) / รายปี (number)
- ระดับอนุมัติตามมูลค่า (dynamic table: ช่วงมูลค่า / ระดับที่อนุมัติ)
- เงื่อนไขบังคับ (checkboxes with labels)
- อัตราส่วน Weighted Pipeline ขั้นต่ำ (number: default 5)
- Button: [บันทึก Policy ▶]

Use Bootstrap 5, Chart.js CDN, Thai labels, google.script.run for all data calls.
```

---

## MODULE 10 — Meeting Records, MOM & Document Tracking

```
Build Module 10: Meeting Records, MOM & Document Tracking for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.
New sheets used: MeetingRecords, MeetingActionItems, DocumentTrackers, DocumentStatusLog

Backend functions to add in Code.gs:

Meeting & MOM:
- getMeetingRecords(filters)           — return meetings filtered by customerId/opportunityId/type/dateRange
- getMeetingById(id)                   — return meeting + attendees + agenda + action items
- createMeetingRecord(data)            — insert MeetingRecords row, auto-create MeetingActionItems rows
- updateMeetingRecord(id, data)        — update meeting details
- getMeetingActionItems(filters)       — return action items filtered by meetingId/assignedTo/status/deadline
- updateActionItemStatus(id, status)   — mark action item done or overdue
- checkOverdueMeetingActions()         — scheduled: set status=overdue where assignedSide=internal AND deadline < today
- generateMOMEmailBody(meetingId)      — return formatted email body from meeting data (Thai language)

Document Tracker:
- getDocumentTrackers(filters)         — return docs filtered by opportunityId/customerId/type/status
- getDocumentById(id)                  — return document + full status history
- createDocumentTracker(data)          — insert DocumentTrackers row
- updateDocumentStatus(id, newStatus, note, sentDate, responseDate) — insert DocumentStatusLog row + update DocumentTrackers current status
- getDocumentDashboard(filters)        — return summary: count by type+status, overdue list, awaiting response list
- getCustomerTimeline(customerId)      — return merged chronological list of VisitReports + MeetingRecords + DocumentTrackers for a customer

Frontend — create MeetingRecordForm.html:
- Header: "บันทึกการประชุม" + meeting type badge, status badge [Draft/Final]
- ข้อมูลการประชุม section:
  - ลูกค้า (searchable dropdown, required)
  - Opportunity ที่เกี่ยวข้อง (dropdown filtered by customer)
  - ประเภทการประชุม (radio with icons):
    🏢 Visit นำเสนอทั่วไป (VST)
    🔧 Technical Meeting (TEC)
    📋 Requirement Meeting (REQ)
    🔄 Follow-up / Progress (FUP)
    📌 อื่นๆ (OTHER + text input)
  - วันที่ + เวลาเริ่ม–สิ้นสุด
  - สถานที่ (text) + toggle Online/Onsite
  - ลิงก์ประชุม (text, show if Online)
- ผู้เข้าร่วมประชุม (dynamic table):
  - Columns: ชื่อ, ตำแหน่ง, ฝ่าย/บริษัท, [ลบ]
  - Pre-fill: current user + contacts from selected customer
  - "+ เพิ่มผู้เข้าร่วม" button adds blank row
- วาระการประชุม (dynamic numbered list): "+ เพิ่มวาระ" button
- บันทึกสาระสำคัญ / มติที่ประชุม (textarea, large)
- ประเมินผลการประชุม:
  - ระดับความคืบหน้า (radio: ก้าวหน้ามาก / ก้าวหน้า / ทรงตัว / ติดขัด)
  - ระดับความสนใจ (radio: Hot🔴 / Warm🟡 / Cold🔵)
  - ความเสี่ยงที่พบ (radio: ไม่มี / มี + textarea)
- Action Items (dynamic table):
  - Columns: Action (text), Deadline (date), ผู้รับผิดชอบ (text), ฝ่าย (radio: internal/customer), [ลบ]
  - "+ เพิ่ม Action Item" button
  - Action Items ฝ่าย internal → auto-create FollowUp in FollowUps sheet after save
- เอกสารที่ต้องดำเนินการต่อ:
  - Checkboxes: TOR / Quotation / Technical Spec / MOU / Contract
  - ถ้าเลือก → show inline mini-form: กำหนดส่งลูกค้า (date) + ผู้รับผิดชอบ
  - "สร้าง Document Tracker อัตโนมัติ" after save
- Buttons: [บันทึก Draft] [บันทึก Final] [สร้าง MOM PDF] [Preview Email สรุป ▶]

Frontend — create MOMEmailPreview.html (modal):
- Preview formatted email (Thai) auto-generated from meeting data:
  - Subject: "สรุปการประชุม [ประเภท] — [วันที่] [ชื่อลูกค้า]"
  - Body sections: ข้อมูลการประชุม, สรุปมติ, Action Items table, ลายเซ็นผู้ส่ง
- To: (pre-fill with customer attendees' emails, editable)
- CC: (pre-fill with internal attendees' emails, editable)
- [แก้ไข Email] button opens editable textarea
- [ส่ง Email จริง ▶] button — use GmailApp.sendEmail() in GAS

Frontend — create MeetingList.html:
- Filter bar: ลูกค้า (dropdown), ประเภท, ช่วงวันที่, ผู้บันทึก
- Table: วันที่, ลูกค้า, ประเภท badge, สรุปสั้น (50 chars), Action Items ค้าง (count badge), [ดู] [แก้ไข]
- Color-code progress: ก้าวหน้ามาก=green / ก้าวหน้า=blue / ทรงตัว=yellow / ติดขัด=red

Frontend — create DocumentTrackerList.html:
- Header: "Document Tracker" + "+ เพิ่มเอกสาร" button
- Filter: ลูกค้า, ประเภทเอกสาร, สถานะ, ผู้รับผิดชอบ
- Alert section at top:
  - 🔴 เกินกำหนด: list cards (ประเภท / ลูกค้า / ครบวันที่ / เกินมา X วัน)
  - 🟡 ใกล้ครบกำหนด (≤3 วัน): same format
  - 📬 รอตอบกลับ >5 วัน: list cards (ประเภท / ลูกค้า / ส่งเมื่อ / รอมา X วัน)
- Main table: # / ลูกค้า / ประเภท / สถานะ (badge) / กำหนดส่ง / วันที่ส่งจริง / รอตอบ / ผู้รับผิดชอบ / [ดู]

Frontend — create DocumentDetail.html (modal or page):
- Header: ประเภทเอกสาร + ลูกค้า + Opportunity, [แก้ไข]
- Status timeline: horizontal step bar showing all possible statuses, current highlighted
- Info: กำหนดส่งลูกค้า / วันที่ส่งจริง / วันที่ลูกค้าตอบ / ผู้รับผิดชอบ / เวอร์ชัน
- Update status section:
  - สถานะใหม่ (select — show only valid next statuses based on current)
  - หมายเหตุ (textarea)
  - วันที่ส่งลูกค้าจริง (date, show if new status = sent)
  - วันที่ลูกค้าตอบกลับ (date, show if new status = customer_review/approved/signed/rejected)
  - แนบไฟล์เวอร์ชันใหม่ (base64 upload)
  - [อัปเดตสถานะ ▶]
- ประวัติสถานะ: timeline list (date / from → to / note / updated by)
- Meeting ที่เกี่ยวข้อง: link back to MeetingRecord ที่สร้างเอกสารนี้

Frontend — create CustomerTimeline.html (tab in CustomerProfile):
- Merged chronological list of ALL activities for this customer:
  - VisitReports (icon: 🏢)
  - MeetingRecords (icon: 📝 VST / 🔧 TEC / 📋 REQ / 🔄 FUP)
  - DocumentTrackers (icon: 📄 TOR / 💰 Quotation / 🔩 TechSpec / 🤝 MOU / 📜 Contract)
  - DemoRequests (icon: 🔬)
- Each item shows: date, type badge, title/summary, status badge, key data point
- Click item → opens relevant detail modal
- Filter: [ทั้งหมด] [Meeting] [เอกสาร] [Demo/Trial] [ปี ▼]
- Document summary sidebar (fixed right): list of all active documents with current status badge and days remaining/overdue

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
GmailApp.sendEmail() for MOM email — requires Gmail scope in GAS manifest.
```

---

## MODULE 11 — Project Management

```
Build Module 11: Project Management for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.
Role: pm (Project Manager) is the primary user. sales/manager can view. management can view dashboard.
New sheets used: Projects, Milestones, ProjectIssues, DeliveryLogs, ProjectMeetings

Trigger: Project is created when Opportunity reaches S6 (PO Received).
PM is assigned by Sales Manager at that point.

Backend functions to add in Code.gs:

Projects:
- getProjects(filters)               — return projects filtered by pmId/customerId/status/healthStatus
- getProjectById(id)                 — return full project + milestones + issues + meetings + delivery logs
- createProject(data)                — insert Projects row, linked to opportunityId
- updateProject(id, data)            — update project fields (stage/status/healthStatus/dates)
- autoCreateProjectFromOpportunity(opportunityId) — triggered when Opportunity stage → S6: create draft Project, notify manager to assign PM
- getProjectDashboard(pmId)          — return: active projects count, overdue milestones, open issues, projects by health status

Milestones:
- getMilestones(projectId)           — return all milestones for a project sorted by plannedDate
- createMilestone(data)              — insert Milestones row
- updateMilestoneStatus(id, status, actualDate, note) — update milestone + recalculate project health
- recalculateProjectHealth(projectId) — rule: if any milestone delayed >7 days = yellow, >14 days or blocked issue = red

Issues & Risks:
- getProjectIssues(projectId, filters) — return issues filtered by type/severity/status
- createProjectIssue(data)            — insert ProjectIssues row, notify PM + manager if severity=high
- updateIssueStatus(id, status, resolution) — update issue status
- getOpenHighSeverityIssues()         — scheduled: return all open high issues for daily alert

Delivery:
- createDeliveryLog(data)            — insert DeliveryLogs row
- getDeliveryLogs(projectId)         — return all delivery records for a project
- closeProject(projectId, note)      — update Project status=closed, record actualEndDate

Project Meetings:
- createProjectMeeting(data)         — insert ProjectMeetings row + auto-create action items in MeetingActionItems sheet
- getProjectMeetings(projectId)      — return all meetings for a project

Customer Assignment:
- assignCustomerToSales(data)        — insert CustomerAssignments row
- getCustomerAssignments(managerId)  — return all assignments under this manager
- getMyCustomers(salesId)            — return customers assigned to this sales person

Frontend — create ProjectBoard.html (for pm + manager + management):
- View switcher: [บอร์ด] [รายการ]
- Board view (grouped by healthStatus):
  - Column 🟢 สุขภาพดี / 🟡 ต้องติดตาม / 🔴 มีปัญหา
  - Each card: ชื่อโครงการ, ลูกค้า, PM, Stage badge, วันส่งมอบ, progress bar (Milestones done/total)
- List view: table with sorting + filter (status/PM/customer/health)
- "+ สร้างโครงการ" button (manager/admin only — for manual creation)

Frontend — create ProjectDetail.html:
- Header: ชื่อโครงการ, ลูกค้า, สถานะ badge, Health badge (🟢🟡🔴), [แก้ไข]
- Info bar: PM / วันเริ่ม / วันส่งมอบแผน / มูลค่าสัญญา / Stage
- Stage progress bar: Planning → Development → UAT → Training → Go-live → Support
- Tabs: [Milestone] [Issue & Risk] [Meeting] [Delivery] [เอกสาร]

  Milestone tab:
  - Timeline list: แต่ละ Milestone แสดง plannedDate / actualDate / status badge / days variance
  - Color: ✅ Done / 🟡 In Progress / 🔴 Delayed / ⚪ Pending
  - [+ เพิ่ม Milestone] button
  - [อัปเดตสถานะ ▶] inline per row

  Issue & Risk tab:
  - Filter: ประเภท (Issue/Risk), ความรุนแรง, สถานะ
  - List: severity badge (🔴High/🟡Med/🟢Low), title, ผู้รับผิดชอบ, due date, status
  - [+ บันทึก Issue/Risk] button

  Meeting tab:
  - List of ProjectMeetings: วันที่, ประเภท badge, สรุปสั้น, Action Items ค้าง
  - [+ บันทึกการประชุม ▶]

  Delivery tab:
  - List of DeliveryLogs: วันที่, ประเภท, รายการ, ผู้รับ, สถานะ signed
  - [+ บันทึกการส่งมอบ ▶]

  เอกสาร tab:
  - DocumentTrackers linked to this project's opportunityId

Frontend — create MilestoneForm.html (modal):
- ชื่อ Milestone (text)
- คำอธิบาย (textarea)
- วันที่แผน (date)
- ผู้รับผิดชอบ (user dropdown)
- [บันทึก ▶]

Frontend — create IssueRiskForm.html (modal):
- ประเภท (radio: Issue / Risk)
- หัวข้อ (text)
- คำอธิบาย (textarea)
- ความรุนแรง (radio: สูง🔴 / กลาง🟡 / ต่ำ🟢)
- ผู้รับผิดชอบ (user dropdown)
- วันกำหนดแก้ไข (date)
- [บันทึก ▶]

Frontend — create DeliveryForm.html (modal):
- ประเภทการส่งมอบ (radio: บางส่วน / ครบถ้วน / Handover ให้ Support)
- วันที่ส่งมอบ (date)
- รายการที่ส่งมอบ (dynamic list + เพิ่ม)
- ผู้รับ (Contacts dropdown from customer)
- แนบเอกสารรับมอบ (base64)
- [บันทึก ▶]

Frontend — create PMDashboard.html (for pm):
- KPI cards: โครงการที่ดูแล / Milestone เกินกำหนด / Issue เปิดอยู่ / โครงการ 🔴
- My Projects list: health badge, ลูกค้า, stage, next milestone + days remaining
- [ดู ProjectBoard ▶] link

Frontend — create CustomerAssignmentView.html (for manager — in ManagerDashboard):
- Table: ลูกค้า / Tier / พนักงานขายที่ดูแล / วันที่มอบหมาย / [เปลี่ยน]
- Modal: เปลี่ยน Sales Assignment + เหตุผล

Use Bootstrap 5, Thai labels, google.script.run for all data calls.
```

---

## MODULE 12 — Product Owner Workspace

```
Build Module 12: Product Owner Workspace for the Sale Tracking prototype.

Using the existing Code.gs and Sheets setup from SETUP PROMPT.
Role: po (Product Owner) is the primary user. pm/manager can view backlog status.
New sheets used: DevBacklog, FeasibilityLogs, RequirementThreads, ReleaseNotes, WinLossLog, CoachingNotes, TeamWorkload

Backend functions to add in Code.gs:

Backlog:
- getDevBacklog(filters)             — return backlog items filtered by status/priority/type/sprint
- getBacklogById(id)                 — return item + feasibility + requirement thread
- createBacklogItem(data)            — insert DevBacklog row (can be from DevRequest or CustomerInsight)
- updateBacklogItem(id, data)        — update priority/status/sprintTarget/poNote
- promoteRequestToBacklog(requestId) — create DevBacklog from DevRequest, link backlogId to DevRequests
- promoteInsightToBacklog(insightId) — create DevBacklog from CustomerInsight
- getBacklogSummary()                — return count by status and priority for dashboard

Feasibility:
- createFeasibilityLog(data)         — insert FeasibilityLogs row
- getFeasibilityByRequest(requestId) — return latest feasibility for a request
- updateFeasibility(id, data)        — update feasibility assessment

Requirement Thread (การโต้ตอบ Requirement ระหว่าง PO กับ Sales):
- getRequirementThread(backlogId)    — return thread messages
- addThreadMessage(backlogId, text)  — append message object {userId, role, text, timestamp} to messages JSON
- resolveThread(backlogId)           — mark thread status=resolved

Release Notes:
- createReleaseNote(data)            — insert ReleaseNotes row
- getReleaseNotes(filters)           — return notes filtered by date/version
- publishReleaseNote(id)             — set publishedAt, send notification to notifyRoles

Win/Loss:
- createWinLossLog(data)             — insert WinLossLog row when Opportunity closes (win or loss)
- getWinLossAnalysis(filters)        — return aggregated win/loss data by period/product/reason

Coaching & Team Workload (for Sales Manager):
- createCoachingNote(salesId, data)  — insert CoachingNotes row
- getCoachingNotes(salesId)          — return coaching history for a salesperson
- updateTeamWorkload(salesId, month, year) — recalculate and upsert TeamWorkload row
- getTeamWorkloadSummary(managerId, month, year) — return workload data for all team members

Frontend — create PODashboard.html (for po):
- KPI cards: รอ Feasibility / อยู่ใน Sprint / Release เดือนนี้ / Requirement Thread เปิดอยู่
- Incoming Requests section:
  - List of DevRequests where status=responded but not yet in backlog
  - Each item: ลูกค้า, ประเภท, ราคาเป้าหมาย, urgency badge, [ประเมิน Feasibility ▶] [เพิ่มใน Backlog ▶]
- Quick links: [ดู Backlog ▶] [สร้าง Release Note ▶]

Frontend — create BacklogBoard.html:
- View switcher: [Kanban] [รายการ]
- Kanban view — 5 columns:
  📥 Backlog → 📋 Planned → 🔄 In Sprint → ✅ Done → ❌ Rejected
  - Each card: priority badge (🔴/🟡/🟢/⚪), title, type badge, estimated days, linked customer count
  - Drag simulation: [ย้ายไป...] dropdown per card
- List view: sortable table with all fields + filter by type/priority/sprint
- "+ เพิ่มรายการ" button

Frontend — create BacklogItemDetail.html (modal or page):
- Header: title, type badge, priority badge, status badge
- Info: ลูกค้าที่เกี่ยวข้อง (from DevRequest/CustomerInsight), estimated days, sprint target
- Tabs: [รายละเอียด] [Feasibility] [Requirement Thread] [ประวัติ]

  รายละเอียด tab:
  - คำอธิบาย, PO Note, links to source DevRequest/CustomerInsight

  Feasibility tab (PO fills):
  - ทำได้หรือไม่ (radio: ✅ ได้ / ❌ ไม่ได้ / ⚠️ ได้มีเงื่อนไข)
  - ประมาณการ (days), ความซับซ้อน (High/Med/Low)
  - ความเสี่ยงทางเทคนิค (textarea)
  - เงื่อนไขที่ต้องครบก่อนพัฒนา (textarea, show if conditional)
  - หมายเหตุทางเทคนิค (textarea)
  - [บันทึก Feasibility ▶] → notify requester (sales) with result

  Requirement Thread tab:
  - Chat-style message list: avatar (role badge), message text, timestamp
  - Messages grouped: Sales (right, blue) / PO (left, green)
  - Input box + [ส่ง ▶] → appends to messages JSON
  - [ปิด Thread ▶] button when resolved

  ประวัติ tab: status change log with timestamp and user

Frontend — create ReleaseNoteForm.html:
- เวอร์ชัน (text: e.g. v2.1.0)
- วันที่ Release (date)
- Features (dynamic list: "+ เพิ่ม feature")
- Bug Fixes (dynamic list)
- หมายเหตุ (textarea)
- แจ้งถึงกลุ่ม (checkboxes: sales / manager / management / pm)
- [Preview] [เผยแพร่ ▶] → create notification for selected roles

Frontend — create ReleaseNoteList.html:
- List of release notes sorted by date desc
- Each card: version badge, date, feature count, notified roles, [ดูรายละเอียด]
- Sales / PM can view but not edit

Frontend — create WinLossForm.html (triggered when Opportunity closes):
- Auto-fill: ลูกค้า, สินค้า, มูลค่า
- ผล (radio: ชนะ 🏆 / แพ้ ❌ / ไม่ตัดสินใจ ⏸)
- If แพ้: เหตุผล (checkboxes: ราคา / Features ไม่ครบ / ความสัมพันธ์ / คู่แข่ง / งบประมาณ / อื่นๆ)
- คู่แข่งที่แพ้ (text, optional)
- หมายเหตุเพิ่มเติม (textarea)
- [บันทึก ▶]

Frontend — create WinLossAnalysis.html (for manager + management):
- Period filter: เดือน / ไตรมาส / ปี
- Summary row: Win X / Loss Y / Win Rate Z%
- Bar chart: Win vs Loss by month (Chart.js)
- Loss reason breakdown: donut chart showing top reasons
- Table: รายการโอกาสที่ปิด พร้อม result badge + reason

Frontend — create CoachingNoteForm.html (for manager — in ManagerDashboard):
- เลือกพนักงานขาย (dropdown)
- บันทึกข้อสังเกต (textarea)
- Action Items (dynamic list: action + deadline)
- วันติดตามครั้งถัดไป (date)
- [บันทึก ▶] → notify salesperson with summary

Frontend — create TeamWorkloadView.html (for manager):
- Month/Year selector
- Table: พนักงานขาย / Visit / Follow-up / Demo / Trial / Opportunity เปิด / สถานะ (badge: ปกติ/หนัก/ว่าง)
- Workload rules: >10 active Opportunities = หนัก; <3 = ว่าง
- [มอบหมายลูกค้า ▶] button per row → opens CustomerAssignmentView

Use Bootstrap 5, Chart.js CDN, Thai labels, google.script.run for all data calls.
```


## MODULE 13 — Sales Pipeline & Budget Control Dashboard [NEW v1.4]

```
Build Module 13: Sales Pipeline & Budget Control Dashboard for the Sale Tracking prototype.

อ้างอิง: Sales Pipeline & Budget Control SRS v1.0
อ้างอิง: Product Portfolio — Digital Hospital Platform (4 กลุ่มผลิตภัณฑ์)

Using the existing Code.gs and Sheets setup from SETUP PROMPT.
New sheets used: BudgetReadiness, SalesStageHistory, ForecastLogs, ProductGroupOpportunities, BudgetYearTargets, PipelineForecastCache

---

### Business Context

ระบบนี้ออกแบบเพื่อติดตามโอกาสขายระบบ Digital Hospital Platform สำหรับโรงพยาบาลรัฐและสังกัดทหาร
โดยใช้ 2 แกนหลักในการวิเคราะห์:

1. Budget Readiness (B0–B4) — ความพร้อมด้านงบประมาณของโรงพยาบาล
2. Sales Stage (S0–S9) — ขั้นตอนการขายที่ทีมดำเนินการ

กลุ่มผลิตภัณฑ์ (Product Groups):
- MEDIQ Platform  : Front Office / Patient Journey (ระบบคิว, นัดหมาย, Kiosk)
- HIS             : Clinical Core (OPD, IPD, ER, Lab, Pharmacy, Billing, CPOE)
- ERP             : Back Office (Inventory, Procurement, Asset, HR, Budget Control)
- Custom Solutions: Telemedicine, IoT, ระบบพิเศษตาม TOR

---

### Budget Readiness Model (B0–B4)

| Code | ชื่อ | ความหมาย | Strategic Level |
|------|------|----------|-----------------|
| B0 | Concept | ยังไม่มีงบ / แนวคิดเบื้องต้น | Cold |
| B1 | Planned | อยู่ในแผนของหน่วยงาน | Warm |
| B2 | Allocated | มีการตั้งงบไว้ | Hot |
| B3 | Approved | งบผ่านอนุมัติในปีงบ | Very Hot |
| B4 | Direct Purchase | มีเงินในมือ / จัดซื้อได้ทันที | Immediate |

### Sales Stage Model (S0–S9)

| Code | Stage | คำอธิบาย |
|------|-------|----------|
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

### Forecast Formula

Expected Revenue = Proposal Value × Stage Probability × Budget Weight

Stage Probability: S3=0.20, S4=0.35, S5=0.50, S6=0.70, S7=0.85, S8=1.00
Budget Weight: B0=0.10, B1=0.30, B2=0.60, B3=0.85, B4=1.00

---

### Backend functions to add in Code.gs:

Budget Readiness:
- getBudgetReadiness(opportunityId)          — return latest budget code + history for an opportunity
- upsertBudgetReadiness(data)               — insert or update BudgetReadiness row
- getBudgetReadinessSummary(filters)         — return count+value grouped by B0–B4 for dashboard

Sales Stage (Extended from Module 4):
- updateOpportunityStageFull(id, stageCode, exitReason) — update Opportunities.stage, insert SalesStageHistory row, update enteredAt for new stage
- getSalesStageHistory(opportunityId)       — return all stage transitions sorted by enteredAt
- getStageDuration(opportunityId, stageCode) — return days spent in a specific stage

Product Group Mapping:
- upsertProductGroupOpportunity(data)       — insert or update ProductGroupOpportunities for an opportunity
- getProductGroupsByOpportunity(opportunityId) — return all product groups mapped to this opportunity
- getProductGroupSummary(filters)           — return pipeline value grouped by MEDIQ/HIS/ERP/Custom

Forecast Engine:
- calculateForecast(opportunityId)          — compute Expected Revenue using Stage Probability × Budget Weight, save to ForecastLogs
- getForecastByPeriod(month, year, filters)  — return sum of Expected Revenue per opportunity for a period
- runMonthlyForecastSnapshot()             — scheduled trigger: calculate and cache forecast for all active opportunities
- getPipelineForecast(filters)             — return cached or fresh forecast with drill-down by stage/budget/product/segment

Budget Year Planning:
- getBudgetYearTargets(salesId, year)       — return targets per product group per segment
- setBudgetYearTarget(data)                — insert or update BudgetYearTargets row (manager only)
- getBudgetYearProgress(year, filters)      — compare targets vs actual closed won by product group

Dashboard Aggregation:
- getPipelineBudgetDashboard(filters)       — master function returning full dashboard data:
  {
    budgetHeatmap: count+value by stage × budget (10×5 matrix S0-S9 × B0-B4),
    forecastByMonth: [{month, expected, target, closedWon}],
    productGroupBreakdown: [{group, pipeline, forecast, closedWon}],
    urgentOpportunities: list of B3+B4 with stage < S5 needing action,
    budgetYearProgress: target vs actual by product group,
    segmentBreakdown: army/government/private pipeline summary
  }

---

### Frontend — create BudgetControlDashboard.html (main page, sales/manager/management):

Header: "Sales Pipeline & Budget Control" + ปีงบประมาณ selector + ส่วนที่ฉัน filter

Section 1 — Budget Heatmap (Pipeline Matrix):
- 2D grid table: แกนนอน = Budget Code B0–B4, แกนตั้ง = Sales Stage S0–S9
- แต่ละ cell แสดง: จำนวน Opportunity + มูลค่ารวม (ล้านบาท)
- Cell color: สีเข้มขึ้นตามค่า Expected Revenue (heat gradient: white→yellow→orange→red)
- คลิก cell → drill-down ไปหน้า BudgetHeatmapDrilldown.html
- Strategic zones highlighted:
  🔴 Action Required: B3/B4 + S0–S3 (มีงบแต่ยังไม่คืบหน้า)
  🟡 Monitor: B2 + S2–S4
  🟢 On Track: B3/B4 + S4–S7

Section 2 — Forecast vs Target Chart:
- Bar+Line chart (Chart.js): แกนนอน = เดือน, แกนซ้าย = มูลค่า (ล้านบาท)
- Stacked bars: Expected Revenue (by budget weight)
- Line: ยอดปิดจริง (Closed Won)
- Dotted line: Monthly Target
- Summary below chart: YTD Expected / YTD Closed / Target / Gap% badge (green/red)

Section 3 — Product Group Breakdown:
- 4 cards แนวนอน (Bootstrap grid):
  🏥 MEDIQ Platform | 🖥️ HIS | 📊 ERP | 🔧 Custom Solutions
- แต่ละ card: Pipeline รวม / Forecast / ปิดแล้ว / Win Rate % / กำลังดำเนิน X โครงการ
- Click card → filter BudgetHeatmap to that product group

Section 4 — Urgent Action List:
- Table: โรงพยาบาลที่มี B3/B4 แต่ Stage < S5 (ต้องเร่งดำเนินการ)
- Columns: ชื่อหน่วยงาน / Budget Code badge / Stage badge / ผลิตภัณฑ์ / มูลค่า / พนักงานขาย / วันอัปเดตล่าสุด / [ดูรายละเอียด ▶]
- Badge colors: B3=orange / B4=red / Stage=gradient S0-S9

Section 5 — Budget Year Progress:
- Table: ผลิตภัณฑ์ / Segment / เป้าปีงบ / Pipeline รวม / Forecast / ปิดแล้ว / % บรรลุ
- Rows grouped by Product Group (MEDIQ/HIS/ERP/Custom)
- Progress bar per row (color: green ≥ 80% / yellow 50-79% / red < 50%)

Section 6 — Segment Summary:
- 3 cards: กองทัพ 🪖 / รัฐบาล 🏛️ / เอกชน 🏥
- แต่ละ card: จำนวน Account / Pipeline รวม / Forecast / ปิดแล้ว

Export: [PDF ▶] [Excel ▶]
Use Chart.js CDN, Bootstrap 5, Thai language throughout.

---

### Frontend — create BudgetHeatmapDrilldown.html (modal or page):

- Header: "รายการ Opportunity — Stage [Sx] + Budget [Bx]"
- Filter: ผลิตภัณฑ์, พนักงานขาย, ภูมิภาค
- Table: ชื่อหน่วยงาน / ประเภท (กองทัพ/รัฐ/เอกชน) / ผลิตภัณฑ์ badge / มูลค่า / Expected Revenue / Budget Code / Stage / พนักงานขาย / วันคาดปิด / [ดูรายละเอียด ▶]
- Each row clickable → opens OpportunityDetail from Module 4
- Summary row at bottom: รวมมูลค่า / รวม Expected Revenue

---

### Frontend — create BudgetReadinessForm.html (modal — ใช้ใน OpportunityDetail):

- Header: "อัปเดต Budget Readiness — [ชื่อหน่วยงาน]"
- Show current budget code badge + ประวัติการเปลี่ยนแปลง (timeline mini)
- เลือก Budget Code ใหม่ (radio with description):
  ○ B0 — ยังไม่มีงบ / แนวคิดเบื้องต้น (Cold)
  ○ B1 — อยู่ในแผนของหน่วยงาน (Warm)
  ○ B2 — มีการตั้งงบไว้ (Hot)
  ○ B3 — งบผ่านอนุมัติในปีงบ (Very Hot)
  ○ B4 — มีเงินในมือ / จัดซื้อได้ทันที (Immediate)
- ปีงบประมาณ (text: e.g. 2568, 2569)
- หมายเหตุ / แหล่งที่มาของข้อมูล (textarea: เช่น "ยืนยันจากรอง ผอ. ในการประชุม 15 ก.พ. 68")
- [บันทึก ▶] → update BudgetReadiness sheet + recalculate Forecast

---

### Frontend — create ProductGroupMappingForm.html (modal — ใช้ใน OpportunityDetail):

- Header: "จับคู่ผลิตภัณฑ์ — [ชื่อหน่วยงาน]"
- 4 accordion sections (one per product group):

  🏥 MEDIQ Platform (Front Office):
  - checkboxes: Smart Queue Management / Appointment Management / Follow-up & Reminder / Self Check-in / Kiosk
  - มูลค่าประมาณ (number input per group)
  - เป็น Lead Product (toggle: ใช่/ไม่ใช่)

  🖥️ HIS — Clinical Core:
  - checkboxes: OPD / IPD / ER / Pharmacy / Laboratory / Radiology / Billing & Financial / Inventory / CPOE / eMAR
  - มูลค่าประมาณ
  - เป็น Lead Product

  📊 ERP — Back Office:
  - checkboxes: Inventory & Warehouse / Procurement / Asset Management / HR Management / Budget Control & Monitoring
  - มูลค่าประมาณ
  - เป็น Lead Product

  🔧 Custom & Special Solutions:
  - checkboxes: Telemedicine / IoT Health Monitoring / Custom Report / ระบบตาม TOR
  - มูลค่าประมาณ
  - หมายเหตุพิเศษ (textarea)

- Auto-sum มูลค่ารวมทุก product group ที่เลือก → suggestion ไปใส่ใน Proposal Value
- [บันทึก ▶]

---

### Frontend — create PipelineForecastView.html (for manager/management):

- Period selector: เดือน / ไตรมาส / ปีงบ
- Filter: พนักงานขาย (multi-select), ผลิตภัณฑ์, Segment, Budget Code ≥ (B0-B4 slider)
- Forecast table:
  Columns: ชื่อหน่วยงาน / ผลิตภัณฑ์ / Stage / Budget / มูลค่าข้อเสนอ / Stage Prob % / Budget Weight / Expected Revenue / วันคาดปิด / พนักงานขาย
  - Sortable by all columns
  - Color-coded rows: B4=red / B3=orange / B2=yellow / B1=green / B0=gray
- Summary footer: จำนวน Opportunity / มูลค่ารวม / Expected Revenue รวม
- Weighted Pipeline total (prominent badge)
- Export: [Excel ▶]

---

### Frontend — update OpportunityDetail.html (Module 4 update):

Add 2 new tabs to OpportunityDetail:
- [Budget & Forecast] tab:
  - Current Budget Code badge (B0–B4) with description + [อัปเดต Budget ▶] → BudgetReadinessForm
  - Budget Year field
  - Forecast calculation panel:
    มูลค่าข้อเสนอ × Stage Probability (from current stage) × Budget Weight (from current budget code) = Expected Revenue
    Show formula visually with colored boxes
  - Budget history timeline (from BudgetReadiness sheet)

- [Product Groups] tab:
  - Summary of selected product groups with estimated values
  - [แก้ไขผลิตภัณฑ์ ▶] → ProductGroupMappingForm
  - Module checklist per product group (from ProductGroupOpportunities)

---

### Frontend — update VisitReportForm.html / PreVisitAssessmentForm.html (integration):

- After saving a Visit Report where interest = Hot OR Hot with B2+ budget:
  - Show prompt: "ต้องการอัปเดต Budget Readiness สำหรับหน่วยงานนี้หรือไม่?" [อัปเดตเลย ▶] [ภายหลัง]
  - If clicked → open BudgetReadinessForm inline

---

### Alert & Notification (new alert types for Module 13):

Add to runDailyAlerts():

checkBudgetReadinessStale()       [NEW v1.4]
  — BudgetReadiness where B2/B3/B4 AND updatedAt < today-30 days AND Opportunity stage < S7
  — notify assignedTo: "Budget ของ [หน่วยงาน] ยังไม่ได้อัปเดตนาน 30 วัน กรุณายืนยันสถานะ"

checkB3B4LowStage()               [NEW v1.4]
  — Opportunities where budgetCode=B3 or B4 AND stage < S3 AND daysInCurrentStage > 14
  — notify sales + manager: "⚠️ [หน่วยงาน] มีงบพร้อมแล้ว (B4/B3) แต่ยังอยู่ใน Stage [Sx] นาน X วัน"

checkForecastVariance()           [NEW v1.4]
  — Compare current month forecast vs last month forecast, if variance > 20%
  — notify manager + management (ALT-BUD-03)

New notification type icons:
- budget_stale         → 💰  [NEW v1.4]
- budget_action_needed → 🎯  [NEW v1.4]
- forecast_variance    → 📉  [NEW v1.4]

Use Bootstrap 5, Chart.js CDN, Thai labels, google.script.run for all data calls.
```

---

## FINAL INTEGRATION PROMPT — v1.4 (รันหลังสุด)

```
Finalize the Sale Tracking System prototype v1.4 by integrating all 13 modules and 6 user roles.

Using all Code.gs functions and HTML files created from all module prompts.

Tasks:

1. Update doGet(e) router with role-based access control.
   Each page handler calls getCurrentUser().role — unauthorized role → UnauthorizedPage.html

   CORE (all roles):
   - page=customers              → CustomerList.html
   - page=customer_profile       → CustomerProfile.html
   - page=notifications          → NotificationList.html

   MODULE 2 — Visit (sales/manager):
   - page=visit_plan             → VisitPlanForm.html
   - page=visit_report           → VisitReportForm.html
   - page=followup               → FollowUpDashboard.html
   - page=approval_inbox         → ApprovalInbox.html

   MODULE 3 — Demo (sales/manager/management):
   - page=demo_request           → DemoRequestForm.html
   - page=demo_progress          → DemoProgressForm.html
   - page=demo_eval              → DemoEvaluationForm.html
   - page=demo_approval          → DemoApprovalInbox.html

   MODULE 4 — Pipeline (sales/manager/management/pm/po view):
   - page=pipeline               → PipelineBoard.html
   - page=opportunity            → OpportunityDetail.html

   MODULE 5 — Insights (sales/manager/po):
   - page=insights               → InsightList.html

   MODULE 6 — Dashboard (role-based):
   - page=my_dashboard           → MyDashboard.html           (sales)
   - page=manager_dashboard      → ManagerDashboard.html      (manager)
   - page=exec_dashboard         → ExecutiveDashboard.html    (management)
   - page=pm_dashboard           → PMDashboard.html           (pm)    [NEW v1.3]
   - page=po_dashboard           → PODashboard.html           (po)    [NEW v1.3]

   MODULE 8 — Calendar (sales/manager):
   - page=calendar               → CalendarView.html
   - page=activity_plan          → ActivityPlanDashboard.html
   - page=pre_visit              → PreVisitAssessmentForm.html
   - page=plan_actual            → PlanActualReport.html

   MODULE 9 — Dev Request (sales/manager/management/po):
   - page=dev_request            → DevRequestForm.html
   - page=dev_response           → DevResponseForm.html       (po only)
   - page=strategic_pricing      → StrategicPricingForm.html
   - page=strategic_approval     → StrategicApprovalView.html (manager/management)
   - page=strategic_dashboard    → StrategicPricingDashboard.html (management)
   - page=policy_settings        → PolicySettings.html        (admin)

   MODULE 10 — Meeting & Documents (all roles):
   - page=meeting_list           → MeetingList.html
   - page=meeting_form           → MeetingRecordForm.html
   - page=document_tracker       → DocumentTrackerList.html
   - page=document_detail        → DocumentDetail.html
   - page=customer_timeline      → CustomerTimeline.html

   MODULE 11 — Project Management [NEW v1.3]:
   - page=project_board          → ProjectBoard.html          (pm/manager/management)
   - page=project_detail         → ProjectDetail.html         (pm/manager/management/sales view)
   - page=win_loss               → WinLossAnalysis.html       (manager/management)

   MODULE 12 — Product Owner Workspace [NEW v1.3]:
   - page=backlog                → BacklogBoard.html          (po/pm/manager)
   - page=backlog_detail         → BacklogItemDetail.html     (po/pm)
   - page=release_notes          → ReleaseNoteList.html       (all roles)
   - page=release_note_form      → ReleaseNoteForm.html       (po only)
   - page=team_workload          → TeamWorkloadView.html      (manager)
   - page=coaching_notes         → CoachingNoteForm.html      (manager)

   MODULE 13 — Sales Pipeline & Budget Control [NEW v1.4]:
   - page=budget_dashboard       → BudgetControlDashboard.html   (sales/manager/management)
   - page=budget_heatmap_drill   → BudgetHeatmapDrilldown.html   (sales/manager/management)
   - page=pipeline_forecast      → PipelineForecastView.html     (manager/management)
   - page=budget_readiness_form  → BudgetReadinessForm.html      (modal, sales/manager)
   - page=product_group_form     → ProductGroupMappingForm.html  (modal, sales/manager)

   - default → role-based:
     sales → my_dashboard | manager → manager_dashboard | management → exec_dashboard
     pm → pm_dashboard | po → po_dashboard | admin → customers

2. Create Role-Based Sidebar.html (v1.3):
   Render different menu groups depending on getCurrentUser().role.

   ทุก Role เห็น:
     🏠 Dashboard          → (role-based default)
     👥 ลูกค้า             → customers
     🔔 การแจ้งเตือน       → notifications
     🚀 Release Notes      → release_notes

   sales เพิ่ม:
     📅 ปฏิทิน             → calendar
     📊 Pipeline           → pipeline
     💰 Budget Control     → budget_dashboard        [NEW v1.4]
     📋 แผนการเข้าพบ       → visit_plan
     📝 Visit Report       → visit_report
     🗒️ บันทึกการประชุม    → meeting_list
     ⏰ Follow-up          → followup
     🔬 Demo / Trial       → demo_request
     📄 เอกสาร Tracker     → document_tracker
     💡 Customer Insight   → insights
     🛠️ Dev Request        → dev_request

   manager เพิ่ม (เหนือกว่า sales):
     ✅ อนุมัติ             → approval_inbox
     📊 ทีม & Workload     → manager_dashboard
     📈 Win/Loss           → win_loss
     📦 Backlog (view)     → backlog
     📉 Forecast View      → pipeline_forecast       [NEW v1.4]

   management เพิ่ม:
     📈 Executive Dashboard → exec_dashboard
     🚨 Strategic Pricing  → strategic_dashboard
     🏗️ Project Board      → project_board
     💰 Budget Control     → budget_dashboard        [NEW v1.4]
     📉 Forecast View      → pipeline_forecast       [NEW v1.4]

   pm เห็น:
     🏗️ Project Board      → project_board
     🗒️ Meeting & Docs     → meeting_list
     📄 เอกสาร Tracker     → document_tracker
     📊 Pipeline (view)    → pipeline

   po เห็น:
     📦 Backlog Board      → backlog
     🛠️ Dev Response       → dev_response
     💡 Customer Insight   → insights

   admin เพิ่ม:
     ⚙️ Policy Settings    → policy_settings

   - User name + role badge at bottom of sidebar
   - Notification bell at top right

3. Update initializeSheets() — 52 sheets total:
   - All previous 46 sheets from v1.3
   - New sheets: BudgetReadiness, SalesStageHistory, ForecastLogs, ProductGroupOpportunities, BudgetYearTargets, PipelineForecastCache
   - Insert default PricingPolicy row
   - Insert sample Users: 1 sales, 1 manager, 1 management, 1 po, 1 pm, 1 admin
   - Insert sample data:
     1 Project (status=active, healthStatus=yellow)
     2 Milestones (1 done, 1 delayed)
     1 ProjectIssue (severity=high, open)
     2 DevBacklog items (1 in_sprint, 1 backlog)
     1 FeasibilityLog (feasible=conditional)
     1 RequirementThread with 3 messages
     1 ReleaseNote (published)
     2 WinLossLog entries (1 win, 1 loss with reasons)
     - Module 13 sample data [NEW v1.4]:
       3 BudgetReadiness rows (1 B2, 1 B3, 1 B4) linked to sample opportunities
       3 SalesStageHistory rows showing stage transitions (S1→S2→S3) for 1 opportunity
       2 ForecastLogs (calculated forecast for sample opportunities)
       3 ProductGroupOpportunities (1 HIS-only, 1 HIS+MEDIQ, 1 full platform)
       2 BudgetYearTargets (HIS target and MEDIQ target for current budget year)
       1 PipelineForecastCache row (cached forecast result for current month)

4. Update getCurrentUser() mock — support all 6 roles via URL parameter:
   ?role=sales | ?role=manager | ?role=management | ?role=po | ?role=pm | ?role=admin
   Default: sales

5. Update runDailyAlerts() — complete v1.4 list:
   checkOverdueFollowUps()
   checkTrialProgressDue()
   checkTrialEndingSoon()
   checkTrialEndedNoEval()
   checkInsightsPendingReview()
   checkActivityPlanProgress()
   checkPreVisitAssessmentDue()
   checkDevRequestOverdue()
   checkStrategicKPIDue()
   checkStrategicBudgetWarning()
   checkDocumentDeadlines()
   checkDocumentAwaitingResponse()
   checkMeetingActionItemsDue()
   checkMilestoneDeadlines()          [NEW v1.3]
   checkOpenHighIssues()              [NEW v1.3]
   checkDevRequestFeasibilityDue()    [NEW v1.3]
   checkRequirementThreadsIdle()      [NEW v1.3]
   checkReleaseNoteUnread()           [NEW v1.3]
   checkBudgetReadinessStale()        [NEW v1.4]
   checkB3B4LowStage()               [NEW v1.4]
   checkForecastVariance()           [NEW v1.4]

6. Add runMonthlyForecastSnapshot() trigger [NEW v1.4]:
   - Called on 1st of each month at 07:00
   - Calculates Expected Revenue for all active Opportunities (stage S3–S7)
   - Saves to ForecastLogs + updates PipelineForecastCache
   - ScriptApp.newTrigger('runMonthlyForecastSnapshot').timeBased().onMonthDay(1).atHour(7).create()

7. Update updateOpportunityStageFull() [NEW v1.4]:
   - When stage changes: insert SalesStageHistory row (exitedAt for old stage, enteredAt for new)
   - Trigger calculateForecast(opportunityId) to refresh Expected Revenue
   - If newStage = S8 (Won): trigger createWinLossLog + autoCreateProjectFromOpportunity

8. Add autoCreateProjectFromOpportunity() trigger:
   - Called inside updateOpportunityStageFull() when newStage = S8 (Won)
   - Creates draft Project row linked to opportunityId + customerId
   - Notifies manager to assign PM

9. Add WinLoss prompt when Opportunity closes:
   - When saving opportunity with stage = S8 or S9
   - Redirect to WinLossForm.html after save
   - WinLossLog row links back to opportunityId

10. Update CustomerProfile.html — add 4 tabs:
    - [Timeline] → CustomerTimeline component filtered by customerId
    - [เอกสาร] → DocumentTrackers for this customer
    - [Project] → linked Projects (name, status, PM name, health badge, stage)
    - [Budget & Forecast] → BudgetReadiness history + current Expected Revenue [NEW v1.4]

11. Update GAS manifest (appsscript.json):
    - Keep Gmail scope: "https://www.googleapis.com/auth/gmail.send"

12. Update README.html:
    - Total: 52 Sheets | 13 Modules | 6 Roles | 50+ หน้าจอ
    - URL parameter role-testing guide (all 6 roles)
    - Gmail scope authorization step
    - Trigger setup note (setupTriggers() once — includes monthly forecast trigger)
    - Budget Readiness model B0–B4 quick reference
    - Product Groups quick reference (MEDIQ/HIS/ERP/Custom)

Make sure all pages include role-based Sidebar and NotificationBell.
Use Bootstrap 5 sidebar layout. Thai language throughout. Mobile-responsive.
```

---

## หมายเหตุสำหรับการใช้งาน

### ลำดับการรัน Prompt
1. `SETUP v1.4` → สร้างโครงสร้างทั้งหมดก่อน (52 sheets)
2. `MODULE 1–13` → รันทีละโมดูลตามลำดับ
3. `FINAL INTEGRATION v1.4` → รันสุดท้ายเพื่อเชื่อมทุกอย่าง

### ลำดับความสำคัญ (ถ้า context ของ IDE จำกัด)
- **Module 1–7** → Core ใช้งานได้ทันที (Sales + Manager ครบ)
- **Module 8–10** → เพิ่มหลังเมื่อ Core เสถียร (Calendar / Dev Request / Meeting)
- **Module 11** → ต้องมี Module 4 (Pipeline) + Module 9 (Dev Request) ก่อน
- **Module 12** → ต้องมี Module 9 (Dev Request) ก่อน
- **Module 13** → ต้องมี Module 4 (Pipeline) ก่อน + แนะนำให้มี Module 2 (Visit) แล้วด้วย

### ทดสอบแต่ละ Role

| Role | URL Parameter | หน้าจอเริ่มต้น | สิ่งที่ทดสอบ |
|---|---|---|---|
| Sales | `?role=sales` | My Dashboard | Visit Plan, Demo, Pipeline, Calendar |
| Sales Manager | `?role=manager` | Manager Dashboard | Team Workload, Approval Inbox, Win/Loss |
| Board | `?role=management` | Executive Dashboard | Revenue vs Target, Strategic Account, Strategic Pricing |
| Product Owner | `?role=po` | PO Dashboard | Backlog, Feasibility, Requirement Thread, Release Note |
| Project Manager | `?role=pm` | PM Dashboard | Project Board, Milestone, Issue/Risk, Delivery |
| Admin | `?role=admin` | Customer List | Policy Settings |

### Tips การทดสอบ Flow ต่อเนื่อง
- **Sales → Opportunity → S6 → Project:** เปลี่ยน Stage เป็น S6 → ดู Project ถูกสร้างอัตโนมัติ → สลับเป็น `?role=manager` → มอบหมาย PM → สลับเป็น `?role=pm` → ดู Project Detail
- **Sales → Dev Request → PO Feasibility → Thread:** สร้าง Dev Request → สลับ `?role=po` → กรอก Feasibility → กลับ Sales ถามใน Thread
- **Sales → Opportunity ปิด → WinLossForm:** ปิด Opportunity เป็น Loss → กรอกเหตุผล → สลับ `?role=management` → ดู Win/Loss Analysis
- ถ้า IDE ตัด context ให้เริ่มด้วย: `"Continue Sale Tracking System v1.4. SETUP done (52 sheets). Now building [MODULE X] for role [ROLE]."`

### ข้อจำกัดของ Prototype นี้
- ไม่มี Authentication จริง (ใช้ mock user + URL parameter)
- Attachment เป็น base64 string — ไม่เหมาะกับไฟล์ขนาดใหญ่
- MOM Email ใช้ GmailApp — ต้องอนุญาต Gmail scope ก่อนใช้งาน
- Google Sheets 52 sheets — เพียงพอสำหรับทีม 20–30 คน ทุก role รวมกัน
- เมื่อพร้อม Production: migrate ไป Cloud SQL / Firebase + OAuth2 + Role Management จริง

---

## ตารางสรุป Role Matrix v1.4

| Module | Sales | Manager | Management | PO | PM | Admin |
|---|---|---|---|---|---|---|
| 1 Customer | ✅ | ✅ | 👁 | 👁 | 👁 | ✅ |
| 2 Visit | ✅ | ✅อนุมัติ | 👁 | — | — | — |
| 3 Demo/Trial | ✅ | ✅อนุมัติ | ✅อนุมัติ | — | — | — |
| 4 Pipeline | ✅ | ✅ | 👁 | 👁 | 👁 | — |
| 5 Insight | ✅ | ✅ | — | ✅รับ | — | — |
| 6 Dashboard | My | Team+Workload | Executive+Revenue | PO Board | PM Board | — |
| 7 Notification | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 Calendar | ✅ | ✅ | — | — | — | — |
| 9 Dev Request | ✅สร้าง | ✅อนุมัติ | ✅Board | ✅ตอบ+Backlog | 👁 | ✅ตั้งค่า |
| 10 Meeting/Doc | ✅ | ✅ | 👁 | 👁 | ✅ | — |
| 11 Project | 👁 | ✅มอบหมาย PM | 👁 | — | ✅ทั้งหมด | — |
| 12 PO/Win-Loss | Win-Loss | ✅Win-Loss+Coaching | ✅Win-Loss | ✅Backlog+Release | 👁 | — |
| 13 Budget Control | ✅ | ✅+Forecast | ✅Dashboard+Forecast | — | — | — |

✅ = แก้ไขได้เต็ม / 👁 = ดูอย่างเดียว / — = ไม่เข้าถึง

---

## ตารางสรุป Module ทั้งหมด v1.4

| Module | ชื่อ | Sheets หลัก | หน้าจอหลัก | Role หลัก |
|---|---|---|---|---|
| 1 | Customer Management | Customers, Contacts | CustomerList, CustomerProfile | sales, manager |
| 2 | Visit & Activity | VisitPlans, VisitReports, FollowUps | VisitPlanForm, VisitReportForm, FollowUpDashboard | sales, manager |
| 3 | Demo & Trial | DemoRequests, DemoProgress, DemoEvaluations | DemoRequestForm, DemoProgressForm, DemoApprovalInbox | sales, manager, management |
| 4 | Sales Pipeline | Opportunities | PipelineBoard, OpportunityDetail | sales, manager |
| 5 | Customer Insight | CustomerInsights | InsightList | sales, manager, po |
| 6 | Dashboard (Multi-role) | WinLossLog, TeamWorkload, CoachingNotes | MyDashboard, ManagerDashboard, ExecutiveDashboard, PMDashboard, PODashboard | ทุก role |
| 7 | Notification & Alert | Notifications | NotificationBell, NotificationList | ทุก role |
| 8 | Activity Planning & Calendar | SalesQuota, CalendarEvents, PreVisitAssessments | CalendarView, ActivityPlanDashboard | sales, manager |
| 9 | Dev Request & Strategic Pricing | DevRequests, DevResponses, StrategicPricings, PricingPolicy | DevRequestForm, StrategicPricingDashboard | sales, manager, management, po |
| 10 | Meeting, MOM & Document | MeetingRecords, MeetingActionItems, DocumentTrackers | MeetingRecordForm, DocumentTrackerList, CustomerTimeline | ทุก role |
| 11 | Project Management | Projects, Milestones, ProjectIssues, DeliveryLogs, CustomerAssignments | ProjectBoard, ProjectDetail, WinLossAnalysis | pm, manager, management |
| 12 | Product Owner Workspace | DevBacklog, FeasibilityLogs, RequirementThreads, ReleaseNotes | BacklogBoard, BacklogItemDetail, ReleaseNoteList | po, manager |
| 13 | Sales Pipeline & Budget Control | BudgetReadiness, SalesStageHistory, ForecastLogs, ProductGroupOpportunities, BudgetYearTargets | BudgetControlDashboard, BudgetHeatmapDrilldown, PipelineForecastView | sales, manager, management |

**รวม 52 Sheets / 13 Modules / 6 Roles / 50+ หน้าจอ**

---

*เอกสารนี้จัดทำสำหรับ Sale Tracking System — Digital Hospital Platform*
*Version 1.4 | กุมภาพันธ์ 2568*
*เพิ่ม: Module 13 (Sales Pipeline & Budget Control Dashboard)*
*อ้างอิง: Sales Pipeline & Budget Control SRS v1.0 + Product Portfolio Digital Hospital Platform*
*รองรับ 6 Roles: Sales / Sales Manager / Board+Management / Product Owner / Project Manager / Admin*
*รองรับ 4 Product Groups: MEDIQ Platform / HIS / ERP / Custom & Special Solutions*
