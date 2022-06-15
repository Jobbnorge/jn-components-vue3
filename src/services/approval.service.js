class ApprovalService {
  constructor() {
    this.jobId = new URLSearchParams(window.location.search).get("jobid");
    this.applicationId = new URLSearchParams(window.location.search).get(
      "applicationid"
    );
    this.templateid = 0; //DocumentTypeID
  }

  GetApproval(approvalId) {
    return this.httpService.get(`approval/${approvalId}`);
  }
  GetApprovalJobGap() {
    return this.httpService.get(`job/${this.jobId}/approval/jobanalysis`);
  }
  GetApprovers() {
    return this.httpService.get(`approval/approvers`);
  }
  FetchUsers(query) {
    return this.httpService.get(`approval/approvers?query=${query}`);
  }
  CreateApproval(data) {
    return this.httpService.post(`/approval`, data);
  }
  UpdateApprover(data) {
    return this.httpService.put("approval", data);
  }
  AddApprovalComment(approvalid, msg) {
    return this.httpService.post(`approval/${approvalid}/comment`, msg);
  }
  GetApprovalComments(approvalid) {
    return this.httpService.get(`approval/comments/${approvalid}`);
  }
  getApprovalStatusForDocument(documentId) {
    return this.httpService.get(
      `approval/status/employmentdocument/${documentId}`
    );
  }
  GetApprovals() {
    return this.httpService.get(`approval`);
  }
  GetPdfFromDocument(approvalId) {
    return this.httpService.getFile(`approval/${approvalId}/pdf`);
  }
  Approve(approvalId) {
    return this.httpService.post(`approval/approve/${approvalId}`);
  }
}
export const approvalService = new ApprovalService();
