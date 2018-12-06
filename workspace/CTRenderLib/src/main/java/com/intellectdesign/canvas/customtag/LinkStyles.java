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

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.intellectdesign.canvas.web.themes.ThemesMap;
import com.intellectdesign.canvas.web.themes.ThemesRegistry;

/**
 * Tag to render the <link> element(s) to include framework/library css files for HTML/XHTML portals.
 * 
 * @version 1.0
 */
public class LinkStyles extends TagSupport
{
	private static final long serialVersionUID = 13221341244L;
	private String LINK_START = "<link rel=\"stylesheet\" type=\"text/css\" href=\"";
	private String LINK_END = "\"/>";

	/**
	 * This class is used to do the EndTag
	 * 
	 * @throws JspException
	 * @return int
	 */
	public int doEndTag() throws JspException
	{
		return super.doEndTag();
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
	 * This class is used to set ThemeId
	 * 
	 * @param themeId to set
	 */

	public void setThemeId(String themeId)
	{
		this.themeId = themeId;
	}

	/**
	 * This class is used to get ThemeId
	 * 
	 * @return Returns the ThemeId
	 */

	public String getThemeId()
	{
		return themeId;
	}

	/**
	 * This class is used to set FontSizeId
	 * 
	 * @param fontSizeId to set
	 */

	public void setFontSizeId(String fontSizeId)
	{
		this.fontSizeId = fontSizeId;
	}

	/**
	 * This class is used to get FontSizeId
	 * 
	 * @return Returns the FontSizeId
	 */

	public String getFontSizeId()
	{
		return fontSizeId;
	}

	/**
	 * This class is used to start the Tag
	 * 
	 * @return int
	 * @throws JspException
	 */
	public int doStartTag() throws JspException
	{
		ServletRequest servletRequest = null;
		HttpServletRequest httpServletRequest = null;
		SessionInfo sessInfo = null;

		ThemesMap themeMap = null;
		try
		{
			servletRequest = pageContext.getRequest();
			if (servletRequest instanceof HttpServletRequest)
			{
				httpServletRequest = (HttpServletRequest) servletRequest;
				LOGGER.ctdebug(
						"CTRND00016",
						"Updated_serverPath pageContext="
								+ pageContext.getServletContext().getRealPath(
										((HttpServletRequest) servletRequest).getContextPath()));
				this.device = (String) httpServletRequest.getAttribute("deviceType");
				this.contextPath = pageContext.getServletContext().getContextPath().replace("/", "");
			}
			ConfigurationManager confMgr = ConfigurationManager.getInstance();
			boolean compressFiles = confMgr.getWebUtilDescriptor().getCompressCSSFlag();
			ArrayList linkFiles = new ArrayList();
			DeviceBandRegistry deviceBandRegistry = DeviceBandRegistry.getInstance();
			String framework = null;
			LOGGER.ctdebug("CTRND00016", "device=" + device);

			DeviceBand selectedBand;
			selectedBand = (DeviceBand) deviceBandRegistry.lookup(this.device);
			framework = selectedBand.getTargetFramework().toString();
			LOGGER.ctdebug("CTRND00016", "framework=" + framework);
			SessionManager sessMngr = SessionManager.getInstance();
			sessInfo = sessMngr.getUserSessionInfo(httpServletRequest);
			themeMap = ThemesRegistry.getTheme(sessInfo.themeId, framework, this.contextPath);
			LOGGER.ctdebug("CTRND00486", sessInfo.themeId, this.device, themeMap);
			boolean isRTLDirection = ("RTL".equalsIgnoreCase(sessInfo.direction));

			if (compressFiles)
			{
				linkFiles.add(getCssCompressData(httpServletRequest, framework + "-structure", true));
				linkFiles.add((themeMap.getRelativePath() + themeMap.getFileName()).replace(".css", "-compress.css"));
				if (isRTLDirection)
				{
					linkFiles.add(getCssCompressData(httpServletRequest, framework + "-rtl", true));
				}

			} else
			{
				linkFiles.add(getCssCompressData(httpServletRequest, framework + "-structure", false));

				linkFiles.add(themeMap.getRelativePath() + themeMap.getFileName());

				if (isRTLDirection)
				{
					linkFiles.add(getCssCompressData(httpServletRequest, framework + "-rtl", false));
				}
				}

			for (int index = 0; index < linkFiles.size(); index++)
			{
				appendStyleSheet((String) linkFiles.get(index));
			}

		} catch (BaseException e)
		{
			LOGGER.cterror("CTRND00383", e);
		} catch (IOException ioe)
		{
			ioe.printStackTrace();
		}

		return SKIP_BODY;
	}

	/**
	 * This class is used to appendStyleSheet
	 * 
	 * @throws IOException
	 */
	private void appendStyleSheet(String styleSheet) throws IOException
	{
		JspWriter out = pageContext.getOut();
		StringBuffer output = new StringBuffer();
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		String contextPath = confMgr.getSecurityDescriptor().getContextPath();
		output.append(this.LINK_START);
		output.append(contextPath + styleSheet);
		output.append(this.LINK_END);
		out.print(output);
	}

	@SuppressWarnings(
	{ "unchecked" })
	/**
	 * Method to return the JavaScriptData.
	 * @param HttpServletRequest
	 * @return String 
	 */
	private String getCssCompressData(HttpServletRequest request, String moduleName, boolean compress)
	{
		LOGGER.ctinfo("CTRND00328");

		String file = null;
		List<Map> cssFileList = null;
		cssFileList = new ArrayList();
		// LOGGER.ctdebug("CTRND00327", "serverPath=" + this.serverPath);
		cssFileList = getCssFileList(cssconfigLocation + systemTheme + "/cssconfig.xml", request);
		// cssFileList = getCssFileList(this.serverPath + cssconfigLocation + systemTheme + "/cssconfig.xml");
		LOGGER.ctdebug("CTRND00327", cssFileList);
		if (cssFileList != null && cssFileList.size() > 0)
		{
			for (int i = 0; i < cssFileList.size(); i++)
			{
				Map modules = cssFileList.get(i);
				Map fileMap = (Map) modules.get(moduleName);
				if (compress)
				{
					file = (String) fileMap.get("folderRef") + moduleName + "-compress.css";
				} else
				{
					file = (String) fileMap.get("folderRef") + moduleName + ".css";
				}

				return file;
			}
		}
		return file;
	}

	/**
	 * Method to return the Css File List.
	 * 
	 * @param HttpServletRequest
	 * @return String
	 */
	private List<Map> getCssFileList(String cssConfigFileName, HttpServletRequest request)
	{
		LOGGER.ctinfo("CTRND00319");
		List cacheList = new ArrayList();// The list which contains the cssFilesMap

		InputStream inputStream = null;

		try
		{
			inputStream = request.getSession().getServletContext().getResourceAsStream(cssConfigFileName);
			Map cssFiles = getCssMap(inputStream);
			cacheList.add(cssFiles);
			LOGGER.ctdebug("CTRND00320", cacheList);

		} catch (ParserConfigurationException e)
		{
			LOGGER.cterror("CTRND00321", e);
		} catch (SAXException e)
		{
			LOGGER.cterror("CTRND00321", e);
		} catch (IOException e)
		{
			LOGGER.cterror("CTRND00322", e);
		} finally
		{
			if (inputStream != null)
			{
				try
				{
					inputStream.close();
				} catch (IOException e)
				{
					LOGGER.cterror("CTRND00322", e);
				}
			}

		}
		LOGGER.ctinfo("CTRND00323");
		return cacheList;
	}

	/**
	 * @param cssFiles
	 * @param inputStream
	 * @throws ParserConfigurationException
	 * @throws SAXException
	 * @throws IOException
	 */
	private Map getCssMap(InputStream inputStream) throws ParserConfigurationException, SAXException, IOException
	{
		List filesList;
		String moduleName;
		Map fileMap;
		Map cssFiles = new HashMap();
		if (inputStream != null)
		{
			DocumentBuilderFactory docBldrFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBldr = docBldrFactory.newDocumentBuilder();
			Document doc = docBldr.parse(inputStream);
			NodeList fileListNodes = doc.getChildNodes().item(0).getChildNodes();
			for (int flCount = 0; flCount < fileListNodes.getLength(); flCount++)
			{

				fileMap = new HashMap();

				Node flNode = fileListNodes.item(flCount);

				if ("theme".equals(flNode.getNodeName()))
				{
					String folderRef = flNode.getAttributes().getNamedItem("folderRef").getNodeValue();
					NamedNodeMap namedNodeMap = flNode.getAttributes();
					Node idAttr = namedNodeMap.getNamedItem("id");
					Node modeAttr = namedNodeMap.getNamedItem("mode");

					moduleName = modeAttr.getNodeValue() + "-" + idAttr.getNodeValue();

					NodeList urlNodes = flNode.getChildNodes();
					filesList = new ArrayList();
					for (int urlCount = 0; urlCount < urlNodes.getLength(); urlCount++)
					{

						Node cssNode = urlNodes.item(urlCount);
						if ("css".equals(cssNode.getNodeName()))
						{
							filesList.add(cssNode.getAttributes().getNamedItem("name").getNodeValue().toString());
						}
					}
					fileMap.put(FrameworkConstants.URLSET, filesList);
					fileMap.put("folderRef", folderRef);
					cssFiles.put(moduleName, fileMap);
				}
			}
		}
		return cssFiles;
	}

	private String themeId = null;
	private String fontSizeId = null;
	private String device = null;
	private String cssconfigLocation = "/CTRIAFramework/UIArena/theme/";
	private String systemTheme = "system";
	private String contextPath = null;

	private static Logger LOGGER = Logger.getLogger(LinkStyles.class);
}
