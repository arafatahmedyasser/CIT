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
package com.intellectdesign.canvas.cache.ondemandjs;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;

/**
 * The class which loads the map containing the Key(The file Id) and the value (The file url) specified in
 * ondemandjsfiles_lib.xml, in the cache,for the js files to load on demand.
 * 
 * @version 1.0
 */
public class OnDemandJSCacheDataBuilder extends CacheDataBuilder
{
	/**
	 * Sub classes should implement this method to put the actual data fetch logic based on the passed session as well
	 * as the configured parameters.
	 * 
	 * @param hashMap
	 * @return List
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	protected List initializeCache(HashMap hashMap)
	{
		LOGGER.ctinfo("CTRND00282");
		List cacheList = new ArrayList();// The list which contains the JsFilesMap

		String gcif = null;
		String userno = null;
		int channelId = 3;
		SessionInfo sessInfo = null;
		sessInfo = (SessionInfo) hashMap.get(CacheConstants.OBJECT_SESSIONINFO);
		if (sessInfo == null)
		{
			LOGGER.cterror("CTVDF00252", sessInfo);
			return null;
		}
		gcif = sessInfo.sCustNo;
		userno = sessInfo.userNo;
		channelId = sessInfo.channelId;
		LOGGER.ctdebug("CTVDF00253", gcif, userno);
		if (gcif == null || userno == null)
		{
			LOGGER.cterror("CTVDF00254");
			return cacheList;
		}

		StringBuffer filesListStrBufr = null;
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		String contextPath = confMgr.getSecurityDescriptor().getContextPath();

		if (channelId == 2)
		{
			if (contextPath.indexOf("/", 0) > -1)
			{
				contextPath = contextPath.substring(1);
			}
		}

		Map jsFiles = new HashMap();// The map which contains the module name(key) & url(value)
		InputStream inputStream = null;
		String moduleName = null;

		try
		{
			// Following String stores Implementation specific On demand xml filename
			String implConfigXml = confMgr.getWebUtilDescriptor().getOnDemandJSURI();
			// Following String stores Canvas FW On demand xml filename
			String fwConfigXml = confMgr.getWebUtilDescriptor().getFwOnDemandJSURI();
			ArrayList<String> confXmlList = new ArrayList<String>();
			// Adding the Canvas on demand configuration file to the list to fetch the array.
			confXmlList.add(fwConfigXml);
			// Adding the Impl secific on demand configuration file as configured in Web Util Descriptor, to the list to
			// fetch the array.
			confXmlList.add(implConfigXml);
			String jsConfigXml = null;
			Map fileMap = null;
			for (int xmlCount = 0; xmlCount < confXmlList.size(); xmlCount++)
			{
				jsConfigXml = confXmlList.get(xmlCount);
				if (jsConfigXml != null)
				{
					inputStream = getClass().getClassLoader().getResourceAsStream(jsConfigXml);
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
							String filesetOrderReq = "N";

							if (FrameworkConstants.NODE_FILESET.equals(flNode.getNodeName()))
							{
								NamedNodeMap namedNodeMap = flNode.getAttributes();
								Node idAttr = namedNodeMap.getNamedItem(FrameworkConstants.ATTR_ID);
								Node orderAttr = namedNodeMap.getNamedItem(FrameworkConstants.ATTR_PRESERVE_ORDER);

								if (orderAttr != null)
								{

									filesetOrderReq = orderAttr.getNodeValue();

								}

								moduleName = idAttr.getNodeValue();

								NodeList urlNodes = flNode.getChildNodes();
								filesListStrBufr = new StringBuffer();
								for (int urlCount = 0; urlCount < urlNodes.getLength(); urlCount++)
								{
									String fileOrderReq = filesetOrderReq;

									Node jsNode = urlNodes.item(urlCount);
									if (FrameworkConstants.NODE_FILE.equals(jsNode.getNodeName()))
									{
										filesListStrBufr.append(contextPath);
										filesListStrBufr.append(jsNode.getAttributes()
												.getNamedItem(FrameworkConstants.ATTR_URL).getNodeValue().toString());
										Node fileOrder = jsNode.getAttributes().getNamedItem(
												FrameworkConstants.ATTR_PRESERVE_ORDER);

										if (fileOrder != null)
										{

											fileOrderReq = fileOrder.getNodeValue();
										}

										filesListStrBufr.append("?" + FrameworkConstants.ATTR_PRESERVE_ORDER + "="
												+ fileOrderReq);
										filesListStrBufr.append(",");
									}
								}
								if (filesListStrBufr.length() > 0)
								{
									filesListStrBufr.deleteCharAt(filesListStrBufr.length() - 1);
								}
								fileMap.put(FrameworkConstants.URLSET, filesListStrBufr.toString());
								fileMap.put(FrameworkConstants.ATTR_PRESERVE_ORDER, filesetOrderReq);
								jsFiles.put(moduleName, fileMap);
							}
						}
					}
				}
			}
			cacheList.add(jsFiles);
			LOGGER.ctdebug("CTRND00013", cacheList);

		} catch (ParserConfigurationException e)
		{
			LOGGER.cterror("CTRND00324", e);
		} catch (SAXException e)
		{
			LOGGER.cterror("CTRND00324", e);
		} catch (IOException e)
		{
			LOGGER.cterror("CTRND00325", e);
		} finally
		{
			if (inputStream != null)
			{
				try
				{
					inputStream.close();
				} catch (IOException e)
				{
					LOGGER.cterror("CTRND00325", e);
				}
			}

		}
		LOGGER.ctinfo("CTRND00283");
		return cacheList;

	}

	/**
	 * This is the base class for all the CacheHandlers.
	 * 
	 * @param arg0
	 * @return String
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	protected String validateParameters(HashMap arg0)
	{
		return null;
	}

	private static Logger LOGGER = Logger.getLogger(OnDemandJSCacheDataBuilder.class);
}
