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

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.servercomm.encryption.EncryptionUtils;
import com.intellectdesign.canvas.servercomm.encryption.ErrorEnum;
import com.intellectdesign.canvas.servercomm.encryption.InvalidImplementationException;
import com.intellectdesign.canvas.servercomm.encryption.PublicKeyContainer;
import com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface;
import com.intellectdesign.canvas.servercomm.encryption.UnAuthorisedException;

/**
 * Servlet implementation class GetPublicKey
 * 
 * @version 1.0
 */
public class GetPublicKey extends HttpServlet
{
	/**
	 * Servlet to provide the public key object to the client, This servlet doesn't need any authentication,
	 * authorization and this servlet should be the first servlet called for a session
	 * 
	 * Note : The data sent by this servlet is not encrypted at all
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * default constructor
	 * 
	 * @see HttpServlet#HttpServlet()
	 */
	public GetPublicKey()
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
	 * handles incoming HTTP POSt requests
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

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String publicKeyClass = configMgr.getImplClassDescriptor().getPublicKeyClass(); // read the public key
																						// implementation class from the
																						// properties file

		PrintWriter out = null;
		try
		{
			out = response.getWriter();
			PublicKeyInterface pubKeyClass = (PublicKeyInterface) Class.forName(publicKeyClass).newInstance(); // create
																												// an
																												// instance
																												// of
																												// the
																												// public
																												// key
																												// implementation
			PublicKeyContainer pubKeyCont = new PublicKeyContainer(request, pubKeyClass); // Instantiate the container
																							// with the publi key impl
			pubKeyCont.printPublicKey(request, response); // call the container to print the key to the client

		} catch (InstantiationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.CONFIGURATION_ERROR,
					new InvalidImplementationException(), "Encryption Implementation is not valid"));
			logger.cterror("CTRND00400", e);
		} catch (IllegalAccessException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.CONFIGURATION_ERROR, new UnAuthorisedException(),
					"Authorisation fail for encryption"));
			logger.cterror("CTRND00401", e);
		} catch (ClassNotFoundException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.CONFIGURATION_ERROR,
					new InvalidImplementationException(), "Encryption Implementation is not valid"));
			logger.cterror("CTRND00402", e);
		} finally
		{

			if (out != null)
			{
				out.close();
			}
		}

	}

	private static final Logger logger = Logger.getLogger(GetPublicKey.class);

}
