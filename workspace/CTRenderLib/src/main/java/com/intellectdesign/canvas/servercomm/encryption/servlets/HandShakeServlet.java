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
 */

package com.intellectdesign.canvas.servercomm.encryption.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.servercomm.encryption.DecryptionException;
import com.intellectdesign.canvas.servercomm.encryption.EncryptionException;
import com.intellectdesign.canvas.servercomm.encryption.EncryptionUtils;
import com.intellectdesign.canvas.servercomm.encryption.ErrorEnum;
import com.intellectdesign.canvas.servercomm.encryption.InvalidImplementationException;
import com.intellectdesign.canvas.servercomm.encryption.InvalidSizeException;
import com.intellectdesign.canvas.servercomm.encryption.UnAuthorisedException;
import com.intellectdesign.canvas.servercomm.encryption.UnSupportedAlgorithmException;
import com.intellectdesign.canvas.servercomm.encryption.UnSupportedProviderException;

/**
 * Servlet implementation class HandShakeServlet
 * 
 * @version 1.0
 */
public class HandShakeServlet extends HttpServlet
{
	/**
	 * Hanshake servlet which recieves the encrypted secret key from the client, decrypts it and encrypts the decrypted
	 * data with the same value as key, and send it back to client so that both client and server are in sync
	 */

	private static final long serialVersionUID = 1L;

	/**
	 * Default constructor
	 * 
	 * @see HttpServlet#HttpServlet()
	 */
	public HandShakeServlet()
	{
		super();
	}

	/**
	 * handles incoming HTTP GET requests
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		doPost(request, response);
	}

	/**
	 * handles incoming HTTP POST requests
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{

		PrintWriter out = response.getWriter();
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			String publicKeyClass = configMgr.getImplClassDescriptor().getPublicKeyClass(); // read the public key
																							// implementation class from
																							// the properties file
			String encryptionKeyClass = configMgr.getImplClassDescriptor().getEncryptionKeyClass();

			String cipherMessage = request.getParameter("key"); // the secret key encrypted with the public key , it
																// should be a hexadecimal representation
			byte[] decodedBytes = EncryptionUtils.hexStringToByteArray(cipherMessage);

			String aesKey = EncryptionUtils.decryptWithPublicKey(publicKeyClass, decodedBytes, request);

			/** Encrypts password using AES **/

			EncryptionUtils.storeSecretKey(encryptionKeyClass, aesKey, request);
			String ciphertext64 = EncryptionUtils.encryptWithSecretKey(encryptionKeyClass, aesKey, request);

			/** Sends response **/
			out.print("{\"key\":\"" + ciphertext64 + "\"}");

			return;
		} catch (ConfigurationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00403", e);
		} catch (InvalidImplementationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00404", e);
		} catch (UnAuthorisedException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00405", e);
		} catch (UnSupportedAlgorithmException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00406", e);
		} catch (DecryptionException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00407", e);
		} catch (EncryptionException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00408", e);
		} catch (UnSupportedProviderException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00409", e);
		} catch (InvalidSizeException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, ""));
			logger.cterror("CTRND00410", e);
		} finally
		{

			if (out != null)
			{
				out.close();
			}
		}
	}

	private static final Logger logger = Logger.getLogger(HandShakeServlet.class);

}
