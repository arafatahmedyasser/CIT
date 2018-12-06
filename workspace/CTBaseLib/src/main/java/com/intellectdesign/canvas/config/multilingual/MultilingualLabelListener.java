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
package com.intellectdesign.canvas.config.multilingual;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.config.MultilingualLabelDescriptor;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.properties.CanvasResourceBundle;
import com.intellectdesign.canvas.properties.MessageManager;

/**
 * This class is for MultilingualLabelListener containg IConfigurationChangeListener
 * 
 * @version 1.0
 */
public class MultilingualLabelListener implements IConfigurationChangeListener
{
	/**
	 * Internal constant for serialization purposes
	 */
	public static final String resourceBundle = "/canvas.resourcebundle";
	public static final String js = ".js";
	public static final String UTF8 = "UTF-8";
	public static final String _en_US = "_en_US";
	private boolean errorFlag = false;
	ServletContext servletContext = null;

	/**
	 * this is ref to MultilngualLableListener ServletContext
	 * 
	 * @param servletContext
	 */
	public MultilingualLabelListener(ServletContext servletContext)
	{
		super();
		this.servletContext = servletContext;
	}

	/**
	 * (non-Javadoc) this is ref to configurationInitialized JSFiles
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	@Override
	public void configurationInitialized()
	{
		// Create the resourcebundle.js files from mycommonlabelcofig.properties file through
		// PropertyToJSConverter.java

		convertPrptTojsfile();
	}

	/**
	 * (non-Javadoc) this is ref to configurationReinitialized JS files
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReinitialized()
	 */
	@Override
	public void configurationReinitialized()
	{
		// Nothing to do here
	}

	/**
	 * This would read configuration info and convert all property files values into javascript object and generate code
	 * to add them to canvas.resourcebundle(javascript class). Throws Exception if given property file name not found
	 */
	@SuppressWarnings("null")
	private void convertPrptTojsfile()
	{

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		MultilingualLabelDescriptor mDescriptor = configMgr.getMultilingualLabelDescriptor();

		try
		{
			String[] prpts = new String[]
			{};
			prpts = mDescriptor.getCtPropertyLabels();

			if (prpts == null)
				prpts = new String[]
				{};

			String[] languages = new String[]
			{};
			languages = mDescriptor.getCtLangCountryCode();

			if (languages == null)
				languages = new String[]
				{};

			String path = mDescriptor.getDefaultPathForBundle();

			if (path == null)
				path = new String();

			// System.out.println("property file names " + ((prpts != null) ? prpts.toString() : "null"));
			// System.out.println("languages file names " + ((languages != null) ? languages.toString() : "null"));
			// System.out.println("path " + ((path != null) ? path.toString() : "null"));

			String prptjson = null;
			StringBuffer output = null;

			BufferedWriter bw;
			output = new StringBuffer("");
			for (int langIndex = 0; langIndex < languages.length; langIndex++)
			{

				/**
				 * Uncomment the below line if we need resourcebundle in languageId wise (Ex: resourcebundle_en_US.js or
				 * resourcebundle_ar_SA.js) String file = path + resourceBundle + languages[langIndex] + js;
				 */

				String file = path + resourceBundle + js;
				bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), UTF8));
				for (int prptIndex = 0; prptIndex < prpts.length; prptIndex++)
				{
					prptjson = loadAndConvertPrptToJson(prpts[prptIndex], languages[langIndex]);
					output.append("/** Adding resource bundle object for property file \"");
					output.append(prpts[prptIndex]);
					output.append("\" and language \"");
					output.append(languages[langIndex]);
					output.append("\" */\n");
					// output.append("iportal.resourcebundle.getInstance().addBundle('");
					output.append("CRB.addBundle('");
					output.append(prpts[prptIndex]);
					output.append("','");
					output.append(languages[langIndex]);
					output.append("',");
					output.append(prptjson);
					output.append(");");
					output.append("\n");
				}
				bw.write(output.toString());
				bw.close();
			}

			if (errorFlag)
				System.err.println("===done with errors====");
			else
				System.out.println("===done====");
		} catch (Exception exp)
		{
			System.err.println("Exception occurred in Property files labels to JS resource " + exp.getStackTrace());
			throw new ConfigurationException("CTBAS00131", "Exception occurred in Property files labels to JS resource", exp);
		}
	}

	/**
	 * Intended to load resource bundle for given property file and language. reads all property file key values and
	 * converts then as JSON represent string.This will consider English bundle as master bundle.If some key values were
	 * missing in any language property file they will be replaced by english keys
	 * 
	 * @param prpt-name of property file to be loaded lang-language code of the property file that need to be loaded.
	 * @return JSON representation string
	 * @throws Exception
	 */
	private String loadAndConvertPrptToJson(String prpt, String lang) throws Exception
	{

		HashMap<String, Object> prptsMap = new HashMap<String, Object>();
		HashMap<String, String> addnlPrptsMap = new HashMap<String, String>();
		try
		{
			ResourceBundle rb = ResourceBundle.getBundle(prpt + "_" + lang);
			ResourceBundle rbEng = ResourceBundle.getBundle(prpt + _en_US);
			if ("canvas-default".equals(prpt))
			{
				ConfigurationManager configMgr = ConfigurationManager.getInstance();
				String overrideBundleName = configMgr.getMultilingualLabelDescriptor().getCtOverrrideBundleName();
				if (!overrideBundleName.isEmpty())
				{
					ResourceBundle overridedRb = ResourceBundle.getBundle(overrideBundleName + "_" + lang);
					ResourceBundle overridedRbEng = ResourceBundle.getBundle(overrideBundleName + _en_US);
					if (overridedRb != null && overridedRbEng != null)
					{
						addnlPrptsMap.putAll(ConvertPrptyToHashMap(overridedRb, overridedRbEng, overrideBundleName,
								lang));
					}
				}
			}
			if (rb != null && rbEng != null)
			{
				prptsMap.putAll(ConvertPrptyToHashMap(rb, rbEng, prpt, lang));
				prptsMap.putAll(addnlPrptsMap);
			}
			// Store the converted bundle as the default framework bundle within the Message Manager only if the bundle
			// is a framework bundle
			if ("canvas-default".equals(prpt))
			{
				CanvasResourceBundle dfltBundle = new CanvasResourceBundle(prptsMap);
				MessageManager.registerDefaultBundle(lang, dfltBundle);
				MessageManager.registerDefaultBundle(prpt + "_" + lang, dfltBundle);
			}
			return HashMapToJSONConverter.convertHashMapToJSONFormat(prptsMap, false);// second parameter indicates
																						// whether to enable HTML encode
																						// or not
		} catch (MissingResourceException e)
		{
			System.out.println("buid completed with errors");
			errorFlag = true;
			System.err.println("error: " + e.toString());
		}
		return HashMapToJSONConverter.convertHashMapToJSONFormat(prptsMap, false);// second parameter indicates whether
																					// to enable HTML encode or not
	}

	/**
	 * This api is used to convert the properties file key value combination in to the hash map.
	 * 
	 * @param rb
	 * @param rbEng
	 * @param prpt
	 * @param lang
	 * @return
	 */
	private HashMap ConvertPrptyToHashMap(ResourceBundle rb, ResourceBundle rbEng, String prpt, String lang)
	{

		HashMap<String, String> prptsMap = new HashMap<String, String>();
		boolean flag = true;
		Enumeration engKeys = rbEng.getKeys();
		String key = null;

		while (engKeys.hasMoreElements())
		{
			key = (String) engKeys.nextElement();
			String value = "";
			try
			{
				if (rb.containsKey(key))
				{
					value = new String(rb.getString(key).getBytes(UTF8), UTF8);
				} else
				{
					if (flag)
					{
						System.out.println("Values for following keys are missing in the bundle " + prpt + "_" + lang
								+ " ,so replaced with values of english bundle");
						flag = false;
					}
					//System.out.println(key);
					value = new String(rbEng.getString(key).getBytes(UTF8), UTF8);
					errorFlag = true;
				}

			} catch (UnsupportedEncodingException e)
			{
				e.printStackTrace();
			}

			prptsMap.put(key, value);
		}
		return prptsMap;
	}

	/**
	 * This is invoked when the application is stopped or shutdown
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#shutDown()
	 */
	@Override
	public void shutDown()
	{
		// Nothing to do here
	}

}
