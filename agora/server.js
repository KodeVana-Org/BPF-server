const RtcTokenBuilder = require("./src/RtcTokenBuilder2.js").RtcTokenBuilder;
const RtcRole = require("./src/RtcTokenBuilder2.js").Role;

require("dotenv").config();

// Need to set environment variable AGORA_APP_ID
const appId = process.env.AGORA_APP_ID;
// Need to set environment variable AGORA_APP_CERTIFICATE
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

exports.GenerateToken = async (req, res) => {
  try {
    const channelName = "test";
    const uid = 123;
    const account = "2882341273";
    const role = RtcRole.PUBLISHER;
    const tokenExpirationInSecond = 3600;
    const privilegeExpirationInSecond = 3600;
    const joinChannelPrivilegeExpireInSeconds = 3600;
    const pubAudioPrivilegeExpireInSeconds = 3600;
    const pubVideoPrivilegeExpireInSeconds = 3600;
    const pubDataStreamPrivilegeExpireInSeconds = 3600;

    if (
      appId == undefined ||
      appId == "" ||
      appCertificate == undefined ||
      appCertificate == ""
    ) {
      console.log(
        "Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE",
      );
      process.exit(1);
    }

    // Build token with uid
    const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      tokenExpirationInSecond,
      privilegeExpirationInSecond,
    );
    console.log("Token with int uid:", tokenWithUid);

    // Build token with user account
    const tokenWithUserAccount = RtcTokenBuilder.buildTokenWithUserAccount(
      appId,
      appCertificate,
      channelName,
      account,
      role,
      tokenExpirationInSecond,
      privilegeExpirationInSecond,
    );
    console.log("Token with user account:", tokenWithUserAccount);

    const tokenWithUidAndPrivilege =
      RtcTokenBuilder.buildTokenWithUidAndPrivilege(
        appId,
        appCertificate,
        channelName,
        uid,
        tokenExpirationInSecond,
        joinChannelPrivilegeExpireInSeconds,
        pubAudioPrivilegeExpireInSeconds,
        pubVideoPrivilegeExpireInSeconds,
        pubDataStreamPrivilegeExpireInSeconds,
      );
    console.log("Token with int uid and privilege:", tokenWithUidAndPrivilege);

    const tokenWithUserAccountAndPrivilege =
      RtcTokenBuilder.BuildTokenWithUserAccountAndPrivilege(
        appId,
        appCertificate,
        channelName,
        account,
        tokenExpirationInSecond,
        joinChannelPrivilegeExpireInSeconds,
        pubAudioPrivilegeExpireInSeconds,
        pubVideoPrivilegeExpireInSeconds,
        pubDataStreamPrivilegeExpireInSeconds,
      );
    return res.status(200).json({
      success: true,
      message: "Token generated successfully",
      tokenWithUid: tokenWithUid,
      tokenWithUserAccount: tokenWithUserAccount,
      tokenWithUidAndPrivilege: tokenWithUidAndPrivilege,
      tokenWithUserAccountAndPrivilege: tokenWithUserAccountAndPrivilege,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error while generating token",
      error: error.message,
    });
  }
};
