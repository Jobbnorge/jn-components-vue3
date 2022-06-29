import { httpService } from "./http.service";


class ApprovalService {
  constructor() {
    this.jobId = new URLSearchParams(window.location.search).get("jobid");
    this.applicationId = new URLSearchParams(window.location.search).get(
      "applicationid"
    );
    this.templateid = 0; //DocumentTypeID
  }

  GetApproval(approvalId) {
    return httpService.get(`approval/${approvalId}`);
  }
  GetApprovalJobGap() {
    return httpService.get(`job/${this.jobId}/approval/jobanalysis`);
  }
  GetApprovers() {
    return httpService.get(`approval/approvers`);
  }
  FetchUsers(query) {
    return httpService.get(`approval/approvers?query=${query}`);
  }
  CreateApproval(data) {
    return httpService.post(`/approval`, data);
  }
  UpdateApprover(data) {
    return httpService.put("approval", data);
  }
  AddApprovalComment(approvalid, msg) {
    return httpService.post(`approval/${approvalid}/comment`, msg);
  }
  GetApprovalComments(approvalid) {
    return httpService.get(`approval/comments/${approvalid}`);
  }
  getApprovalStatusForDocument(documentId) {
    return httpService.get(
      `approval/status/employmentdocument/${documentId}`
    );
  }
  GetApprovals() {
    return httpService.get(`approval`);
  }
  GetPdfFromDocument(approvalId) {
    return httpService.getFile(`approval/${approvalId}/pdf`);
  }
  Approve(approvalId) {
    return httpService.post(`approval/approve/${approvalId}`);
  }
}
export const approvalService = new ApprovalService();
