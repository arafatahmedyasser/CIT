/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */

package com.intellectdesign.canvas.common;

import java.io.Serializable;
/**
 * This POJO class maintains values for login Reg User Val
 * 
 * @version 1.0
 */
public class LoginRegUserValue implements Serializable
{

	/**
	 * Internal constant for serilaization
	 */
	private static final long serialVersionUID = 248656339275072712L;

	private String loginId;
	private String userNo;
	private String firstName;
	private String middleName;
	private String lastName;
	private int pwdPolicyNo;
	private String defaultLangCode;
	private String registerStatus;
	private String mobileNo;
	private String emailId;
	private String RSATokenSerialNo;
	private String RSATokenRollingNo;
	private String previousRSATokenRollingNo;
	private boolean isUserExist = false;
	private String newPassword;
	private String confirmPassword;
	private boolean isRSARollingNoExist = false;
	private boolean isEncrypt = false;
	private String forgot;
	private String customerId;
	private String regId;

	/***
	 * method that gets regId
	 * 
	 * @return regId
	 */
	public String getRegId()
	{
		return regId;
	}

	/***
	 * method that sets regId
	 * 
	 * @param regId
	 */

	public void setRegId(String regId)
	{
		this.regId = regId;
	}

	/***
	 * method that gets customerId
	 * 
	 * @return customerId
	 */

	public String getCustomerId()
	{
		return customerId;
	}

	/***
	 * method that sets customerId
	 * 
	 * @param customerId
	 */

	public void setCustomerId(String customerId)
	{
		this.customerId = customerId;
	}

	/***
	 * method that gets forgot
	 * 
	 * @return forgot
	 */

	public String getForgot()
	{
		return forgot;
	}

	/***
	 * method that sets forgot
	 * 
	 * @param forgot
	 */

	public void setForgot(String forgot)
	{
		this.forgot = forgot;
	}

	/***
	 * method that gets isEncrypt
	 * 
	 * @return isEncrypt boolean
	 */

	public boolean isEncrypt()
	{
		return isEncrypt;
	}

	/***
	 * method that sets isEncrypt
	 * 
	 * @param isEncrypt
	 */

	public void setEncrypt(boolean isEncrypt)
	{
		this.isEncrypt = isEncrypt;
	}

	/***
	 * method that gets userNo
	 * 
	 * @return userNo
	 */

	public String getUserNo()
	{
		return userNo;
	}

	/***
	 * method that sets userNo
	 * 
	 * @param userNo
	 */

	public void setUserNo(String userNo)
	{
		this.userNo = userNo;
	}

	/***
	 * method that gets firstName
	 * 
	 * @return firstName
	 */

	public String getFirstName()
	{
		return firstName;
	}

	/***
	 * method that sets firstName
	 * 
	 * @param firstName
	 */

	public void setFirstName(String firstName)
	{
		this.firstName = firstName;
	}

	/***
	 * method that gets middleName
	 * 
	 * @return middleName
	 */
	public String getMiddleName()
	{
		return middleName;
	}

	/***
	 * method that sets middleName
	 * 
	 * @param middleName
	 */

	public void setMiddleName(String middleName)
	{
		this.middleName = middleName;
	}

	/***
	 * method that gets lastName
	 * 
	 * @return lastName
	 */

	public String getLastName()
	{
		return lastName;
	}

	/***
	 * method that sets lastName
	 * 
	 * @param lastName
	 */

	public void setLastName(String lastName)
	{
		this.lastName = lastName;
	}

	/***
	 * method that gets pwdPolicyNo
	 * 
	 * @return pwdPolicyNo
	 */

	public int getPwdPolicyNo()
	{
		return pwdPolicyNo;
	}

	/***
	 * method that sets pwdPolicyNo
	 * 
	 * @param pwdPolicyNo
	 */

	public void setPwdPolicyNo(int pwdPolicyNo)
	{
		this.pwdPolicyNo = pwdPolicyNo;
	}

	/***
	 * method that gets defaultLangCode
	 * 
	 * @return defaultLangCode
	 */

	public String getDefaultLangCode()
	{
		return defaultLangCode;
	}

	/***
	 * method that sets defaultLangCode
	 * 
	 * @param defaultLangCode
	 */

	public void setDefaultLangCode(String defaultLangCode)
	{
		this.defaultLangCode = defaultLangCode;
	}

	/***
	 * method that gets registerStatus
	 * 
	 * @return registerStatus
	 */

	public String getRegisterStatus()
	{
		return registerStatus;
	}

	/***
	 * method that sets registerStatus
	 * 
	 * @param registerStatus
	 */

	public void setRegisterStatus(String registerStatus)
	{
		this.registerStatus = registerStatus;
	}

	/***
	 * method that gets isRSARollingNoExist
	 * 
	 * @return isRSARollingNoExist boolean
	 */

	public boolean isRSARollingNoExist()
	{
		return isRSARollingNoExist;
	}

	/***
	 * method that sets isRSARollingNoExist
	 * 
	 * @param isRSARollingNoExist
	 */

	public void setRSARollingNoExist(boolean isRSARollingNoExist)
	{
		this.isRSARollingNoExist = isRSARollingNoExist;
	}

	/***
	 * method that gets loginId
	 * 
	 * @return loginId
	 */

	public String getLoginId()
	{
		return loginId;
	}

	/***
	 * method that sets loginId
	 * 
	 * @param loginId
	 */

	public void setLoginId(String loginId)
	{
		this.loginId = loginId;
	}

	/***
	 * method that gets mobileNo
	 * 
	 * @return mobileNo
	 */

	public String getMobileNo()
	{
		return mobileNo;
	}

	/***
	 * method that sets mobileNo
	 * 
	 * @param mobileNo
	 */

	public void setMobileNo(String mobileNo)
	{
		this.mobileNo = mobileNo;
	}

	/***
	 * method that gets emailId
	 * 
	 * @return emailId
	 */

	public String getEmailId()
	{
		return emailId;
	}

	/***
	 * method that sets emailId
	 * 
	 * @param emailId
	 */

	public void setEmailId(String emailId)
	{
		this.emailId = emailId;
	}

	/***
	 * method that gets RSATokenSerialNo
	 * 
	 * @return RSATokenSerialNo
	 */

	public String getRSATokenSerialNo()
	{
		return RSATokenSerialNo;
	}

	/***
	 * method that sets rSATokenSerialNo
	 * 
	 * @param rSATokenSerialNo
	 */

	public void setRSATokenSerialNo(String rSATokenSerialNo)
	{
		RSATokenSerialNo = rSATokenSerialNo;
	}

	/***
	 * method that gets RSATokenRollingNo
	 * 
	 * @return RSATokenRollingNo
	 */

	public String getRSATokenRollingNo()
	{
		return RSATokenRollingNo;
	}

	/***
	 * method that sets rSATokenRollingNo
	 * 
	 * @param rSATokenRollingNo
	 */

	public void setRSATokenRollingNo(String rSATokenRollingNo)
	{
		RSATokenRollingNo = rSATokenRollingNo;
	}

	/***
	 * method that gets isUserExist
	 * 
	 * @return isUserExist boolean
	 */

	public boolean isUserExist()
	{
		return isUserExist;
	}

	/***
	 * method that sets isUserExist
	 * 
	 * @param isUserExist boolean
	 */

	public void setUserExist(boolean isUserExist)
	{
		this.isUserExist = isUserExist;
	}

	/***
	 * method that gets newPassword
	 * 
	 * @return newPassword
	 */
	public String getNewPassword()
	{
		return newPassword;
	}

	/***
	 * method that sets newPassword
	 * 
	 * @param newPassword
	 */

	public void setNewPassword(String newPassword)
	{
		this.newPassword = newPassword;
	}

	/***
	 * method that gets confirmPassword
	 * 
	 * @return confirmPassword
	 */

	public String getConfirmPassword()
	{
		return confirmPassword;
	}

	/***
	 * method that sets confirmPassword
	 * 
	 * @param confirmPassword
	 */

	public void setConfirmPassword(String confirmPassword)
	{
		this.confirmPassword = confirmPassword;
	}
	
	/**
	 * @return the previousRSATokenRollingNo
	 */
	public String getPreviousRSATokenRollingNo()
	{
		return previousRSATokenRollingNo;
	}

	/**
	 * @param previousRSATokenRollingNo the previousRSATokenRollingNo to set
	 */
	public void setPreviousRSATokenRollingNo(String previousRSATokenRollingNo)
	{
		this.previousRSATokenRollingNo = previousRSATokenRollingNo;
	}


}
