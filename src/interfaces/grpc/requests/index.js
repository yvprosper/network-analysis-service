import { VerifyTokenRequest, GetManyUsersRequest } from "stubs/user/messages_pb";
import { PublishEventRequest, DeviceInfo } from "stubs/auditlog/messages_pb";
import { QueueEmailRequest, Attachment, QueueSmsRequest } from "stubs/notification/messages_pb";
import { GetActorByIdRequest } from "stubs/tm_actors/messages_pb";

// VerifyToken
export const createVerifyTokenRequest = (data) => {
  const verifyTokenRequest = new VerifyTokenRequest();
  verifyTokenRequest.setToken(data.token);
  verifyTokenRequest.setTokenType(data.tokenType);
  verifyTokenRequest.setCurrentUrl(data.currentUrl);
  verifyTokenRequest.setIpAddress(data.ipAddress);
  return verifyTokenRequest;
};

// AuditLog
const createDeviceInfo = (data) => {
  const deviceInfo = new DeviceInfo();
  deviceInfo.setBrowser(data.browser);
  deviceInfo.setOs(data.os);
  deviceInfo.setVersion(data.version);
  return deviceInfo;
};

export const createPublishEventRequest = (data) => {
  const deviceInfo = createDeviceInfo(data.deviceInfo);
  const publishEventRequest = new PublishEventRequest();
  publishEventRequest.setDeviceInfo(deviceInfo);
  publishEventRequest.setActivity(data.activity);
  publishEventRequest.setBusinessId(data.businessId.toString());
  publishEventRequest.setBusinessType(data.businessType);
  publishEventRequest.setEvent(data.event);
  publishEventRequest.setIpAddress(data.ipAddress);
  publishEventRequest.setResource(data.resource);
  publishEventRequest.setActivityDetail(data.activityDetail || "");
  publishEventRequest.setUserId(data.userId.toString());
  return publishEventRequest;
};

// GetManyUsers
export const createGetManyUsersRequest = (userIdsList) => {
  const getManyUsersRequest = new GetManyUsersRequest();
  getManyUsersRequest.setUserIdsList(userIdsList);
  return getManyUsersRequest;
};

// Queue Email
const createAttachmentList = (attachments) => {
  if (!attachments) return [];
  const emailAttachments = attachments.map((emailAttachment) => {
    const attachment = new Attachment();
    attachment.setFilename(emailAttachment.filename);
    attachment.setUrl(emailAttachment.url);
    return attachment;
  });

  return emailAttachments;
};

export const createQueueEmailRequest = (data) => {
  const attachments = createAttachmentList(data.attachments);
  const queueEmailRequest = new QueueEmailRequest();
  queueEmailRequest.setBccsList(data.bcc);
  queueEmailRequest.setAttachmentsList(attachments);
  queueEmailRequest.setCcsList(data.cc);
  queueEmailRequest.setFrom(data.from);
  queueEmailRequest.setReplyTo(data.replyTo);
  queueEmailRequest.setSubject(data.subject);
  queueEmailRequest.setTemplateName(data.templateName);
  queueEmailRequest.setTemplatePayload(JSON.stringify(data.templatePayload));
  queueEmailRequest.setTosList(data.to);
  return queueEmailRequest;
};

// Queue SMS
export const createQueueSmsRequest = (data) => {
  const queueSmsRequest = new QueueSmsRequest();
  queueSmsRequest.setFrom(data.from);
  queueSmsRequest.setMessage(data.message);
  queueSmsRequest.setPhoneNumber(data.phoneNumber);
  return queueSmsRequest;
};

export const createGetActorByIdRequest = (data) => {
  const actorById = new GetActorByIdRequest();
  actorById.setActorId(data.actorId);
  actorById.setBusinessId(data.actorId);
  return actorById;
};
