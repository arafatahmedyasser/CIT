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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.deviceband.DeviceBand;
import com.intellectdesign.canvas.deviceband.DeviceBandRegistry;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * 
 * Reads entries from jsfiles_lib.config and render the <script> element(s) to include framework/library js files(extjs,
 * plug-in, etc) for HTML/XHTML portals.
 * 
 * @version 1.0
 */
public class CanvasScriptInitalizer extends TagSupport
{

	private static final long serialVersionUID = 1L;

	private String SCRIPT_START = "<script type=\"text/javascript\" src=\"";
	private String SCRIPT_END = "\"></script>";
	private final static String CT_BASE_NODES = "CT_CORE,CT_CONTROLLERS,CT_METADATA_JS,CT_METADATA_PERSIST,CT_METADATA_SER,CT_ENCRYPTION";
	private final static String CT_VIEW_NODES = "CT_RESOURCE_BUNDLE_JS,CT_RESOURCE_BUNDLE_SER";
	private final static String CT_SUB_BASE_NODES = "CT_METADATA_SYNC";
	private boolean debug = false;

	/**
	 * This class is used to set MergedName
	 * 
	 * @param MergedName to set
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
	 * This class is used to set ModuleId
	 * 
	 * @param ModuleId to set
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

	public String getModuleId(String framework)
	{
		if ("CT-LIB".equals(moduleId))
		{
			moduleId = CT_BASE_NODES + "," + framework + "," + CT_VIEW_NODES;
		} else if ("CT_VIEW_BASE".equals(moduleId))
		{
			moduleId = framework + "_" + "CT_VIEW_BASE";
			
			if ("jqtbs".equals(framework))
			{
				moduleId = moduleId + "," + framework + "_CT_TEMPLATES";
			}

			if ("ext".equals(framework) && this.lSessionInfo.mLanguage != null
					&& !"en_US".equals(this.lSessionInfo.mLanguage))
			{
				moduleId = moduleId + "," + "ext-lang-" + this.lSessionInfo.mLanguage;
			}

			boolean isRTLDirection = ("RTL".equalsIgnoreCase(lSessionInfo.direction));
			if (isRTLDirection)
			{
				moduleId = moduleId + "," + framework + "_RTL";
			}
			moduleId = moduleId + ","+ CT_SUB_BASE_NODES;
		}
		return moduleId;
	}

	/**
	 * method used to process the Javascript
	 * 
	 * @param module
	 * @param isMultiple
	 * @return String
	 */
	private String processJavascript(String module)
	{

		String jsFiles = null;
		InputStream is = null;
		String moduleName = null;
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		boolean compressFiles = confMgr.getWebUtilDescriptor().getCompressJSFlag();

		try
		{

			if (debug || "CT_METADATA_SER".equals(module) || "CT_RESOURCE_BUNDLE_SER".equals(module))
			{

				ConfigurationManager configMgr = ConfigurationManager.getInstance();
				String jsConfigXml = configMgr.getWebUtilDescriptor().getFwOnDemandJSURI();
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
			} else
			{
				if (compressFiles)
				{
					appendScript("/CTRIAFramework/javascript/compress/" + module + ".js");
				} else
				{
					appendScript("/CTRIAFramework/javascript/combine/" + module + ".js");
				}
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

			} catch (Exception ee)
			{
				LOGGER.cterror("CTRND00295", ee);
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

		String[] moduleArray = null;
		ServletRequest servletRequest = null;
		HttpServletRequest httpServletRequest = null;
		StringBuffer realPath = null;
		String servletPath = null;
		servletRequest = pageContext.getRequest();
		if (servletRequest instanceof HttpServletRequest)
		{
			httpServletRequest = (HttpServletRequest) servletRequest;
			realPath = httpServletRequest.getRequestURL();
			servletPath = httpServletRequest.getRequestURI();
			realPath.delete(realPath.indexOf(servletPath), realPath.length());
			this.device = (String) httpServletRequest.getAttribute("deviceType");
			SessionManager lSessionManager = SessionManager.getInstance();
			this.lSessionInfo = lSessionManager.getUserSessionInfo(httpServletRequest);
		}
		DeviceBandRegistry deviceBandRegistry = DeviceBandRegistry.getInstance();
		String framework = null;

		try
		{
			DeviceBand selectedBand;
			selectedBand = (DeviceBand) deviceBandRegistry.lookup(this.device);
			framework = selectedBand.getTargetFramework().toString();

		} catch (BaseException e)
		{

			e.printStackTrace();
		}

		if (getModuleId(framework).contains(","))
		{

			moduleArray = getModuleId(framework).split(",");
			for (int i = 0; i < moduleArray.length; i++)
			{
				processJavascript(moduleArray[i].toString());
			}

		} else
		{
			processJavascript(getModuleId(framework));
		}
		return 1;
	}

	/**
	 * This class is used to append the script
	 * 
	 * @param jsFile
	 * @throws IOException
	 */
	private void appendScript(String jsFile) throws IOException
	{
		JspWriter out = null;
		out = pageContext.getOut();
		StringBuffer output = new StringBuffer();
		output.append(this.SCRIPT_START);
		output.append(buildScriptURL(pageContext.getServletContext().getContextPath(), jsFile)); 
		output.append(this.SCRIPT_END);
		output.append("\n");
		out.print(output);
		output.setLength(0);
		LOGGER.ctdebug("Include Resources output -->" + output); 
	}
	 

	/**
	 * This method builds the script URL to the JS File. AS part of the construction, tries to resolve the file and
	 * generate an ETag for it. In case of errors, then the ETag is not appended to the URL
	 * 
	 * @param contextPath The contextPath
	 * @param jsFile The JS File URL
	 * @return The full script path
	 */
	private String buildScriptURL(String contextPath, String jsFile)
	{
		String tag = "";
		String result = contextPath + jsFile;
		try
		{
			tag = getETagForFile(jsFile);
		} catch (IOException e)
		{
			LOGGER.ctwarn("CTVDF00342", e, jsFile);
		}
		if (!StringUtils.isEmpty(tag))
			result += "?tag=" + tag;
		return result;
	}

	private String getETagForFile(String fileName) throws IOException
	{
		String realFilePath = pageContext.getServletContext().getRealPath(fileName);
		File bundleFile = new File(realFilePath);
		if (!bundleFile.exists())
			throw new IOException("Unable to load file from path '" + realFilePath + "'"); 
		long fileSize = bundleFile.length();
		long lastModified = bundleFile.lastModified();
		String eTag = fileSize + "_" + lastModified;
		return eTag;
	}

	 
	private String moduleId = null;
	private String mergedName = null;
	private String device = null;
	private SessionInfo lSessionInfo = null;
	private Logger LOGGER = Logger.getLogger(this.getClass());
}
