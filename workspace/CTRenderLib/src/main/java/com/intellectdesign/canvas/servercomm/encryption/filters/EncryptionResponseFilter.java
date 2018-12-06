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

package com.intellectdesign.canvas.servercomm.encryption.filters;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.servercomm.encryption.EncryptionException;
import com.intellectdesign.canvas.servercomm.encryption.EncryptionUtils;
import com.intellectdesign.canvas.servercomm.encryption.ErrorEnum;
import com.intellectdesign.canvas.servercomm.encryption.InvalidImplementationException;
import com.intellectdesign.canvas.servercomm.encryption.InvalidSizeException;
import com.intellectdesign.canvas.servercomm.encryption.UnAuthorisedException;
import com.intellectdesign.canvas.servercomm.encryption.UnSupportedAlgorithmException;
import com.intellectdesign.canvas.servercomm.encryption.UnSupportedProviderException;

/**
 * Servlet Filter implementation class EncryptionFilter
 * 
 * @version 1.0
 */
public class EncryptionResponseFilter implements Filter
{
	/**
	 * Encryption Filter , checks for encrypted data from the client , decrypts it and set it in the hashmap and forward
	 * the request
	 */

	/**
	 * Default constructor.
	 */
	public EncryptionResponseFilter()
	{
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy()
	{
	}

	/**
	 * This method block filters the input data and decrypts that and set those in the hashmap and pass it on to the
	 * serlvets
	 * 
	 * @param request
	 * @param response
	 * @param chain
	 * @throws IOException
	 * @throws ServletException
	 * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse,
	 *      javax.servlet.FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException
	{

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		boolean encryptServerCallsInd = configMgr.getSystemPrefDescriptor().getEncryptServerCallsInd();

		if (!encryptServerCallsInd)
		{
			chain.doFilter(request, response);
			return;
		}

		PrintWriter out = response.getWriter();
		String serverResponse = null;

		String encryptionKeyClass = configMgr.getImplClassDescriptor().getEncryptionKeyClass();
		// wrap the response before passing it to the filters
		CharResponseWrapper responseWrapper = new CharResponseWrapper((HttpServletResponse) response);

		try
		{
			// pass the request along the filter chain
			chain.doFilter(request, responseWrapper);

			// going to modify the response content
			serverResponse = new String(responseWrapper.toString());
			// validate the response and throw exception
			/** Encrypts data using AES **/
			String cipherText64 = EncryptionUtils.encryptWithSecretKey(encryptionKeyClass, serverResponse,
					(HttpServletRequest) request); // encrypting the secret key with the secret key as the pay load

			StringBuilder sb = new StringBuilder();
			sb.append("{\"status\":\"Success\",");
			sb.append("\"statuscode\":\"200\",");
			sb.append("\"data\":\"");
			sb.append(cipherText64);
			sb.append("\"}");

			out.write(sb.toString());
			out.close();
		} catch (ConfigurationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00393", e);

		} catch (InvalidSizeException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00394", e);

		} catch (InvalidImplementationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00395", e);

		} catch (UnAuthorisedException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00396", e);

		} catch (EncryptionException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00397", e);

		} catch (UnSupportedAlgorithmException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00398", e);

		} catch (UnSupportedProviderException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e, serverResponse));
			out.close();
			logger.cterror("CTRND00399", e);

		} finally
		{
			if (out != null)
			{
				out.close(); // since this is the last place of action we are closing the output stream here
			}
		}
	}

	/**
	 * Initializing the filter config
	 * 
	 * @param fConfig
	 * @throws ServletException
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException
	{
	}

	private static final Logger logger = Logger.getLogger(EncryptionResponseFilter.class);

}
