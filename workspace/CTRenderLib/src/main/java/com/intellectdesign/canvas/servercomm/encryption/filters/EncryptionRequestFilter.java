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
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.servercomm.encryption.EncryptionUtils;
import com.intellectdesign.canvas.servercomm.encryption.ErrorEnum;
import com.intellectdesign.canvas.servercomm.encryption.InvalidImplementationException;
import com.intellectdesign.canvas.servercomm.encryption.InvalidPrivateKeyException;
import com.intellectdesign.canvas.servercomm.encryption.InvalidSizeException;
import com.intellectdesign.canvas.servercomm.encryption.NullDataException;
import com.intellectdesign.canvas.servercomm.encryption.UnAuthorisedException;
import com.intellectdesign.canvas.servercomm.encryption.UnSupportedAlgorithmException;
import com.intellectdesign.canvas.servercomm.encryption.UnSupportedProviderException;

/**
 * Servlet Filter implementation class EncryptionFilter
 * 
 * @version 1.0
 */
public class EncryptionRequestFilter implements Filter
{
	/**
	 * Encryption Filter , checks for encrypted data from the client , decrypts it and set it in the hashmap and forward
	 * the request
	 */

	/**
	 * Default constructor.
	 */
	public EncryptionRequestFilter()
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

		String encryptionKeyClass = configMgr.getImplClassDescriptor().getEncryptionKeyClass();
		// wrap the response before passing it to the filters
		HttpServletRequest wrappedRequest = null;

		try
		{

			String paramValue = ((HttpServletRequest) request).getParameter("data"); // all the params should be stream
																						// lined into a single param
																						// called "data"

			EncryptionUtils.validateEncryptedData(paramValue);
			// check the param for proper key value

			String data = EncryptionUtils.decryptWithSecretKey(encryptionKeyClass, paramValue, request);

			EncryptionUtils.validateDecryptedData(data);

			/**
			 * construct the hashmap or a bean and set all the key value pair here
			 */
			HashMap<String, String[]> hm = new HashMap<String, String[]>();
			String[] params = data.split("&");
			for (String param : params)
			{
				String pair[] = param.split("=");
				String key = URLDecoder.decode(pair[0], "UTF-8");
				String value = "";
				if (pair.length > 1)
				{
					value = URLDecoder.decode(pair[1], "UTF-8");
				}
				String[] values = hm.get(key);
				if (values == null)
				{
					ArrayList<String> al = new ArrayList<String>();
					al.add(value);
					hm.put(key, al.toArray(new String[al.size()]));
				} else
				{
					ArrayList<String> al = new ArrayList<String>(Arrays.asList(values));
					al.add(value);
					hm.put(key, al.toArray(new String[al.size()]));
				}
			}

			wrappedRequest = new CustomRequestWrapper((HttpServletRequest) request, hm);

		} catch (ConfigurationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "Invalid configuration for encryption")));
			out.close();
			logger.cterror("CTRND00385", e);
		} catch (NullDataException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "null data for decryption")));
			out.close();
			logger.cterror("CTRND00386", e);

		} catch (InvalidPrivateKeyException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "private key mismatch")));
			out.close();
			logger.cterror("CTRND00387", e);

		} catch (UnSupportedAlgorithmException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "Invalid algorithim for encryption")));
			out.close();
			logger.cterror("CTRND00388", e);

		} catch (UnSupportedProviderException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "Unsupported encryption formate")));
			out.close();
			logger.cterror("CTRND00389", e);

		} catch (InvalidImplementationException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "Invalid implmentaion for encryption")));
			out.close();
			logger.cterror("CTRND00390", e);

		} catch (UnAuthorisedException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "Encryption authorization failed")));
			out.close();
			logger.cterror("CTRND00391", e);

		} catch (InvalidSizeException e)
		{
			out.write(EncryptionUtils.constructError(ErrorEnum.DECRYPTION_ERROR, e,
					EncryptionUtils.createJson("data", "Invalid size for encryption")));
			out.close();
			logger.cterror("CTRND00392", e);

		}
		chain.doFilter(wrappedRequest, response);
	}

	/**
	 * Initialization of filter config
	 * 
	 * @param fConfig
	 * @throws ServletException
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException
	{
	}

	private static final Logger logger = Logger.getLogger(EncryptionRequestFilter.class);

}
