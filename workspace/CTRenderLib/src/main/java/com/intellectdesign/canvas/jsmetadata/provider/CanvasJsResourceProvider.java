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
package com.intellectdesign.canvas.jsmetadata.provider;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.MultilingualLabelDescriptor;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.jsmetadata.ICanvasJsDataProvider;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class used to stream the Js-Resoucebundle (canvas-resourcebundle.js) file from Server's
 * (DEFUALT_PATH_FOR_BUNDLE) resource bundle stored temparary path to client side in ondemand manner.
 * 
 * @version 1.0
 */
public class CanvasJsResourceProvider implements ICanvasJsDataProvider
{

	public static final String resourceBundle = "/canvas.resourcebundle";

	@SuppressWarnings(
	{ "unchecked" })
	/**
	 * Method to return the JavaScript Resourcebundle
	 * @param HttpServletRequest
	 * @return String 
	 */
	public String getJavaScriptData(HttpServletRequest request) throws ProcessingErrorException
	{
		logger.ctdebug("CTRND00095");
		StringBuilder jsResourceBundle = new StringBuilder();

		FileInputStream fis = null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			MultilingualLabelDescriptor mDescriptor = configMgr.getMultilingualLabelDescriptor();
			String jsResourcePath = mDescriptor.getDefaultPathForBundle();

			Charset charset = Charset.forName("utf-8");
			File file = new File(jsResourcePath + resourceBundle + ".js");
			if (!file.exists())
			{
				throw new ProcessingErrorException(
						"JS Resource bundle file is not available in the configurated server local temp path of "
								+ jsResourcePath
								+ " Check with MultilingualDescriptor configuration in Serverstartup...");
			}
			fis = new FileInputStream(file);
			isr = new InputStreamReader(fis, charset);
			br = new BufferedReader(isr);
			String line;
			while ((line = br.readLine()) != null)
			{
				// process the line
				jsResourceBundle = jsResourceBundle.append(line);
			}
			br.close();
			isr.close();
			fis.close();
		} catch (IOException ioExcep)
		{
			logger.cterror("CTRND00303", ioExcep);
			return null;
		} catch (ProcessingErrorException processingErrException)
		{
			logger.cterror("CTRND00304", processingErrException);
		} finally
		{
			if (br != null)
			{
				try
				{
					br.close();
				} catch (IOException e)
				{
					logger.cterror("CTRND00096", e);
				}
			}

			if (isr != null)
			{
				try
				{
					isr.close();
				} catch (IOException e)
				{
					logger.cterror("CTRND00097", e);
				}
			}

			if (fis != null)
			{
				try
				{
					fis.close();
				} catch (IOException e)
				{
					logger.cterror("CTRND00098", e);
				}
			}

		}
		logger.ctdebug("CTRND00099", jsResourceBundle);
		logger.ctdebug("CTRND00100");
		return jsResourceBundle.toString();
	}

	private static final Logger logger = Logger.getLogger(CanvasJsResourceProvider.class);
}