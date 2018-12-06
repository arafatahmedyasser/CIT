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

package com.intellectdesign.canvas.customtag;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.FileUtils;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;

/**
 * Reads entries from jsfiles_lib.config and render the <script> element(s) to include framework/library js files(extjs,
 * plug-in, etc) for HTML/XHTML portals.
 * 
 * @version 1.0
 * @deprecated This is no longer used. Instead use the CanvasScriptInitializer custom tag.
 */
public class IncludeScripts extends TagSupport
{

	private String SCRIPT_START = "<script type=\"text/javascript\" src=\"";
	private String SCRIPT_END = "\"></script>";
	private final static String JSCONFIG_FILE = "JSCONFIG_FILE";
	private final static String JSCONFIG_FILE_MOBILE = "JSCONFIG_FILE_MOBILE";
	private final static String JSCONFIG_COMPRESSED_FILE = "JSCONFIG_COMPRESSED_FILE";

	/**
	 * This class is used to set MergedName
	 * 
	 * @param mergedName to set
	 */
	public void setMergedName(String mergedName)
	{
		this.mergedName = mergedName;
	}

	/**
	 * This class is used to get MergedName
	 * 
	 * @return Returns the MergedName
	 */

	public String getMergedName()
	{
		return mergedName;
	}

	/**
	 * This class is used to set Device
	 * 
	 * @param device to set
	 */
	public void setDevice(String device)
	{
		this.device = device;
	}

	/**
	 * This class is used to get Device
	 * 
	 * @return Returns the Device
	 */

	public String getDevice()
	{
		return device;
	}

	/**
	 * This class is used to set ModuleId
	 * 
	 * @param moduleId to set
	 */

	public void setModuleId(String moduleId)
	{
		this.moduleId = moduleId;
	}

	/**
	 * This class is used to get ModuleId
	 * 
	 * @return Returns the ModuleId
	 */

	public String getModuleId()
	{
		return moduleId;
	}

	/**
	 * method used to process the Javascript
	 * 
	 * @param module
	 * @param isMultiple
	 * @return String
	 */

	private String processJavascript(String module, Boolean isMultiple)
	{
		String jsFiles = null;
		String line;
		String jsConfigFile;
		InputStream is = null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		String moduleName = null;
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		boolean compressFiles = confMgr.getWebUtilDescriptor().getCompressJSFlag();
		try
		{
			if (!getModuleId().equals(FrameworkConstants.JSFILES_LIB))
			{
				String jsConfigXml = confMgr.getWebUtilDescriptor().getOnDemandJSURI();
				if (jsConfigXml != null)
				{
					is = getClass().getClassLoader().getResourceAsStream(jsConfigXml);
					if (is != null)
					{
						DocumentBuilderFactory docBldrFactory = DocumentBuilderFactory.newInstance();
						DocumentBuilder docBldr = docBldrFactory.newDocumentBuilder();
						Document doc = docBldr.parse(is);
						NodeList fileListNodes = doc.getChildNodes().item(0).getChildNodes();
						for (int flCount = 0; flCount < fileListNodes.getLength(); flCount++)
						{
							Node flNode = fileListNodes.item(flCount);
							if (FrameworkConstants.NODE_FILESET.equals(flNode.getNodeName()))
							{
								NamedNodeMap namedNodeMap = flNode.getAttributes();
								Node idAttr = namedNodeMap.getNamedItem(FrameworkConstants.ATTR_ID);
								moduleName = idAttr.getNodeValue();
								if (moduleName.equals(module))
								{
									String compressedFile = "/iportal/compressed/" + module + "-compressed.js";
									if (isMultiple)
									{

										return compressedFile;
									}

									else
									{
										NodeList urlNodes = flNode.getChildNodes();
										for (int urlCount = 0; urlCount < urlNodes.getLength(); urlCount++)
										{
											Node jsNode = urlNodes.item(urlCount);
											if (FrameworkConstants.NODE_FILE.equals(jsNode.getNodeName()))
											{
												appendScript(jsNode.getAttributes()
														.getNamedItem(FrameworkConstants.ATTR_URL).getNodeValue()
														.toString());
											}
										}
										break;
									}
								}
							}
						}

					}
				}
			} else
			{
				if (compressFiles)
				{
					jsConfigFile = CTProperties.getProperty(JSCONFIG_COMPRESSED_FILE);
				}
				// Reades the JS libaray configuaration file path from Orbidirect.properties file.
				// So there should be an entry in Orbidirect.properties file with the Key "JSCONFIG_FILE"
				// value as the path to the "jsfiles_lib.config"

				else
				{
					jsConfigFile = getDevice().equals("mobile") ? CTProperties.getProperty(JSCONFIG_FILE_MOBILE)
							: CTProperties.getProperty(JSCONFIG_FILE);
				}

				is = getClass().getClassLoader().getResourceAsStream(jsConfigFile);
				isr = new InputStreamReader(is);
				br = new BufferedReader(isr);

				while ((line = br.readLine()) != null)
				{
					if (line != null & line.length() > 0)
					{
						appendScript(line);
					}
				}
				br.close();
			}

		} catch (IOException ioe)
		{
			ioe.printStackTrace();
		} catch (SAXException SAXexception)
		{
			SAXexception.printStackTrace();
		} catch (ParserConfigurationException pce)
		{
			pce.printStackTrace();
		} finally
		{
			try
			{
				if (is != null)
					is.close();
				if (isr != null)
					isr.close();
				if (br != null)
					br.close();

			} catch (Exception ee)
			{
				LOGGER.cterror("CTRND00299", ee);
			}
		}
		return jsFiles;

	}

	/**
	 * This class is used to start the Tag
	 * 
	 * @return Returns
	 * @throws JspException
	 */

	public int doStartTag() throws JspException
	{
		try
		{
			String[] moduleArray = null;
			ServletRequest servletRequest = null;
			HttpServletRequest httpServletRequest = null;
			StringBuffer realPath = null;
			String servletPath = null;
			servletRequest = pageContext.getRequest();
			Boolean isMultipleRequest = false;
			Boolean isWriteReq = false;
			ConfigurationManager confMgr = ConfigurationManager.getInstance();
			boolean compressFiles = confMgr.getWebUtilDescriptor().getCompressJSFlag();
			if (servletRequest instanceof HttpServletRequest)
			{
				httpServletRequest = (HttpServletRequest) servletRequest;
				realPath = httpServletRequest.getRequestURL();
				servletPath = httpServletRequest.getRequestURI();
				realPath.delete(realPath.indexOf(servletPath), realPath.length());
				this.serverPath = pageContext.getServletContext().getRealPath("/");

			}

			if (getModuleId().contains(","))
			{
				String mergedContent = null;
				String mergedFilePath = "/iportal/jsfiles/" + getMergedName();
				File mergedFile = new File(this.serverPath, URLDecoder.decode((String) mergedFilePath, "UTF-8"));
				if (mergedFile.exists() && mergedFile.isFile())
				{

					mergedContent = FileUtils.readFileToString(mergedFile);
				}
				StringBuffer jsContent = new StringBuffer();
				moduleArray = getModuleId().split(",");
				for (int i = 0; i < moduleArray.length; i++)
				{
					isMultipleRequest = compressFiles;
					if (isMultipleRequest)
					{
						String jsFileString = processJavascript(moduleArray[i].toString(), isMultipleRequest);
						File jsFile = new File(this.serverPath, URLDecoder.decode(jsFileString, "UTF-8"));
						if (jsFile.isFile() && jsFile.exists())
						{
							String content = FileUtils.readFileToString(jsFile);
							jsContent.append(content);
							jsContent.append(System.getProperty("line.separator"));
						} else
						{
							LOGGER.cterror("CTRND00015", jsFileString);
						}
					} else
					{
						processJavascript(moduleArray[i].toString(), isMultipleRequest);
					}

				}
				if (isMultipleRequest)
				{
					if (mergedFile.isFile())
					{
						if (mergedContent != null && !mergedContent.toString().contentEquals(jsContent))
						{
							FileUtils.writeStringToFile(mergedFile, "", "UTF-8");
							isWriteReq = true;
						} else if (mergedContent.toString().contentEquals(jsContent))
						{
							isWriteReq = false;
						} else
						{
							isWriteReq = true;
						}
					} else
					{
						isWriteReq = mergedFile.createNewFile();
					}
					if (isWriteReq)
					{
						FileUtils.writeStringToFile(mergedFile, jsContent.toString(), "UTF-8");
					}
					appendScript(mergedFilePath);
				}

			} else
			{
				isMultipleRequest = false;
				processJavascript(getModuleId(), isMultipleRequest);
			}
		} catch (UnsupportedEncodingException e)
		{

			e.printStackTrace();
		} catch (IOException e)
		{

			e.printStackTrace();
		}
		return SKIP_BODY;
	}

	/**
	 * This class is used to append the script
	 * 
	 * @param jsFile
	 * @throws IOException
	 */

	private void appendScript(String jsFile) throws IOException
	{
		JspWriter out = pageContext.getOut();
		StringBuffer output = new StringBuffer();
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		String contextPath = confMgr.getSecurityDescriptor().getContextPath();
		output.append(this.SCRIPT_START);
		output.append(contextPath + jsFile);
		output.append(this.SCRIPT_END);
		output.append("\n");
		out.print(output);
		output.setLength(0);
	}

	private String device = null;
	private String moduleId = null;
	private String mergedName = null;
	private String serverPath = null;
	private Logger LOGGER = Logger.getLogger(this.getClass());

}
