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
package com.intellectdesign.canvas.cache.handler;

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
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class parses the CTdefaultcacheconfig.xml. The process method parses the xml and returns List of cache
 * configuration Maps. A Cache is expected to be structured as below -
 * 
 * <Cache Id="<Cache Id>" Scope="<application/session>" Preload="<Y/N>" Validating="<Y/N>"> <Handler><The Cache data
 * handler class></Handler> </Cache>
 * 
 * The root element for the Cache config is the key <AllCaches>. This supports an optional attribute called "mode". The
 * possible values for "mode" are -
 * <p>
 * <ul>
 * <li>local - this means that the client and server modules are deployed together. So no bean call required. This is
 * the default.</li>
 * <li>remote - this means that the client and server modules are remotely deployed. So remote bean call is required.</li>
 * </ul>
 * </p>
 * 
 * @version 1.0
 */
public final class CacheConfigParser
{
	/**
	 * Its contain CACHE & Handler node's attributes values and temp_hm2 hashmap
	 */
	private static final String HASH_SYMBOL = "#";

	private Map cacheMap = new HashMap(); // Its contain CACHE & Handler node's attributes values and temp_hm2 hashmap
	private Map cacheParamMap = new HashMap(); // Its contain Param node's values
	private List al = null;
	private Document document = null;
	private String mode = null;

	/**
	 * Default Constructor
	 */
	public CacheConfigParser()
	{
	}

	/**
	 * this is ref to GetMode CacheValue
	 * 
	 * @return the mode
	 */
	public String getMode()
	{
		return mode;
	}

	/**
	 * this is ref to SetMode cachevalue
	 * 
	 * @param modeValue the mode to set
	 */
	public void setMode(String modeValue)
	{
		this.mode = modeValue;
	}

	/**
	 * Constructor that takes CacheConfigXML InputStream as parameter
	 * 
	 * @param inputStream The XML input stream to be parsed
	 */
	public CacheConfigParser(InputStream inputStream)
	{
		String cacheConfigFile = null;
		try
		{
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			document = db.parse(new InputSource(inputStream));
			LOGGER.ctdebug("CTCAC00001", document);

		} catch (ParserConfigurationException e1)
		{
			LOGGER.cterror("CTCAC00002", e1, cacheConfigFile);
		} catch (SAXException e)
		{
			LOGGER.cterror("CTCAC00002", e, cacheConfigFile);
		} catch (IOException e)
		{
			LOGGER.cterror("CTCAC00002", e, cacheConfigFile);
		}
	}

	/**
	 * This is the () should call from outside the class to parse the xml file. process() will return ArrayList which
	 * contains the HashMaps HashMaps have the parsed xml values
	 * 
	 * @return al (arraylist)
	 * 
	 */
	public List process()
	{
		LOGGER.ctdebug("CTCAC00003");
		process(document);
		LOGGER.ctdebug("CTCAC00004", al);
		LOGGER.ctdebug("CTCAC00005");
		return al;
	}

	/**
	 * This () will get NODE element by using document object
	 * 
	 * @param doc
	 */
	private void process(Document doc)
	{
		identifyMode(doc);
		NodeList nl = doc.getElementsByTagName(CacheConstants.CACHE);
		if (nl != null)
		{
			populateWSIDetails(nl);
		}
	}

	/**
	 * Helper method which identifies the mode at the root element
	 * 
	 * @param doc
	 */
	private void identifyMode(Document doc)
	{
		Element rootElem = doc.getDocumentElement();
		if (rootElem != null)
		{
			if (rootElem.hasAttribute(CacheConstants.FIELD_MODE))
			{
				this.mode = rootElem.getAttribute(CacheConstants.FIELD_MODE);
				LOGGER.ctdebug("CTCAC00006", this.mode);
			}
		}
	}

	/**
	 * Method that Populates all CacheConfigXML details
	 * 
	 * @param nl NodeList
	 */
	private void populateWSIDetails(NodeList nl)
	{
		int listLength = nl.getLength();
		String nodeName = "";
		Node node = null;
		al = new ArrayList();
		Map hmap1 = null;
		Map hmap2 = null;

		// Get the NodeList length and call populateNodeDetails()
		for (int i = 0; i < listLength; i++)
		{
			node = nl.item(i);
			nodeName = node.getNodeName();
			if (!nodeName.startsWith(HASH_SYMBOL))
			{
				hmap1 = populateNodeDetails(node);
				hmap1 = new HashMap(cacheMap);
				hmap2 = new HashMap(cacheParamMap);
				hmap1.put(CacheConstants.FIELD_PARAMETERS, hmap2);
				LOGGER.ctdebug("CTCAC00007", i, hmap1);
				al.add(hmap1);
			}
			cacheMap.clear();
			cacheParamMap.clear();
		}

	}

	/**
	 * Method that Populates all Other Node Details
	 * 
	 * @param ele Node
	 */
	private Map populateNodeDetails(Node ele)
	{

		String nodename = ele.getNodeName();
		String attributeval = "";
		String attributename = "";
		Node temp_node = null;
		if (!nodename.startsWith(HASH_SYMBOL))
		{
			NamedNodeMap nm = ele.getAttributes();
			if (nm != null)
			{
				attributeval = "";
				for (int j = 0; j < nm.getLength(); j++)
				{
					attributename = nm.item(j).getNodeName();
					attributeval = nm.item(j).getNodeValue();
					if (nodename.equals(CacheConstants.CACHE))
					{
						cacheMap.put(attributename, attributeval);
					}
				}
			}
		}

		NodeList nl = ele.getChildNodes();
		LOGGER.ctdebug("CTCAC00008", nl.getLength());
		for (int i = 0; i < nl.getLength(); i++)
		{
			if (nodename.equals(CacheConstants.FIELD_HANDLER))
			{
				cacheMap.put(nodename, (nl.item(i).getNodeValue()));
			}

			if (nodename.equals(CacheConstants.FIELD_PARAM))
			{
				cacheParamMap.put(attributeval, nl.item(i).getNodeValue());
			}
			temp_node = nl.item(i);
			populateNodeDetails(temp_node);
		}
		cacheMap.put(CacheConstants.FIELD_PARAM, cacheParamMap);
		return (cacheMap);
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger LOGGER = Logger.getLogger(CacheConfigParser.class);
}
