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

package com.intellectdesign.canvas.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This class contains utility methods for parsing XML. This typically uses a DOM parser to parse an XML into a Document
 * Node. Also provides methods for converting a XML into a Map Structure
 * 
 * @version 1.0
 */
public final class XMLUtils
{
	/**
	 * This is the key used when converting a node to a Map. Under this key, the actual node id / name will be stored
	 */
	public static final String FIELD_NODE_KEY = "KEY";

	/**
	 * This is the key used when converting a node to a Map. Under this key, the value for that node will be stored.
	 */
	public static final String FIELD_NODE_VALUE = "VALUE";

	/**
	 * This is the key used when converting a node to a Map. Under this key, the attributes read for that node will be
	 * stored
	 */
	public static final String FIELD_NODE_ATTRIBUTES = "ATTRS";

	/**
	 * This is the key used when converting a node to a map. Under this key, the child elements present under that node
	 * will be stored
	 */
	public static final String FIELD_CHILDREN = "CHILDREN";

	/**
	 * Marking the only constructor as private to avoid any instantiation of this class.
	 */
	private XMLUtils()
	{
	}

	/**
	 * This method parses the given XML content and loads the same into a document node
	 * 
	 * @param xmlContent The actual XML content
	 * @return The Document node corresponding to the XML content
	 * @throws BaseException Thrown if the xmlContent is not a valid XML.
	 */
	public static Document parseXML(String xmlContent) throws BaseException
	{
		Document xmlDoc = null;
		if (!StringUtils.isEmpty(xmlContent))
		{
			xmlDoc = parseXML(new ByteArrayInputStream(xmlContent.getBytes()));
		}
		return xmlDoc;
	}

	/**
	 * This method parses the given XML file and loads the same into a document node
	 * 
	 * @param xmlFile The file containing XML content
	 * @return The Document node corresponding to the XML content
	 * @throws BaseException Thrown if the file is not a valid XML file or if the File is not present or cannot be read
	 */
	public static Document parseXML(File xmlFile) throws BaseException
	{
		Document xmlDoc = null;
		// Ensure that the file is present and can be read.
		if (xmlFile != null && xmlFile.canRead())
		{
			try
			{
				xmlDoc = parseXML(new FileInputStream(xmlFile));
			} catch (FileNotFoundException e)
			{
				throw new BaseException("ERR_FILE_PARSE", "Unable to load file provided", e);
			}
		}
		return xmlDoc;
	}

	/**
	 * This method parses the stream into the XML document structure
	 * 
	 * @param xmlStream The input Stream to be parsed
	 * @return The Document node corresponding to the XML content
	 * @throws BaseException Thrown if the Stream is not a valid XML stream
	 */
	public static Document parseXML(InputStream xmlStream) throws BaseException
	{
		Document xmlDoc = null;
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		try
		{
			DocumentBuilder builder = factory.newDocumentBuilder();
			xmlDoc = builder.parse(xmlStream);
		} catch (ParserConfigurationException e)
		{
			throw new BaseException("ERR_XML_PARSE", "Error while parsing XML", e);
		} catch (SAXException e)
		{
			throw new BaseException("ERR_XML_PARSE", "Error while parsing XML", e);
		} catch (IOException e)
		{
			throw new BaseException("ERR_XML_PARSE", "Error while parsing XML", e);
		}
		return xmlDoc;
	}

	/**
	 * This method retrieves all the attributes configured at the node level as a map
	 * 
	 * @param aNode The node for which attributes has to be retrieved.
	 * @return Map containing the key as the attribute name and value as the attribute value. If no attributes are
	 *         present, then empty map is returned
	 * @throws BaseException Thrown if any error occurs while retrieving attribute details
	 */
	public static Map<String, String> getAllAttributes(Node aNode) throws BaseException
	{
		Map<String, String> attributesMap = new HashMap<String, String>();
		if (aNode.hasAttributes())
		{
			NamedNodeMap attrList = aNode.getAttributes();
			int numAttr = attrList.getLength();
			for (int counter = 0; counter < numAttr; counter++)
			{
				attributesMap.put(attrList.item(counter).getNodeName(), attrList.item(counter).getNodeValue());
			}
		}
		return attributesMap;
	}

	/**
	 * This method retrieves all the attributes configured at the Root element of the Document as a map
	 * 
	 * @param xmlDoc The Document for which attributes has to be retrieved at the root element.
	 * @return Map containing the key as the attribute name and value as the attribute value. If no attributes are
	 *         present, then empty map is returned
	 * @throws BaseException Thrown if any error occurs while retrieving attribute details
	 */
	public static Map<String, String> getAllAttributes(Document xmlDoc) throws BaseException
	{
		Node rootNode = xmlDoc.getDocumentElement();
		return getAllAttributes(rootNode);
	}

	/**
	 * This method converts a Document into a Map representation. This uses a simple pattern of loading, the Name,
	 * Value, attributes and child elements as a set of Map having lists of content etc.
	 * 
	 * @param xmlDoc The XML Document to be converted to a Map representation
	 * @return A Map representation of the Document
	 * @throws BaseException Thrown if any error occurs while converting the Document to a Map
	 */
	public static Map<String, Object> getDocumentAsMap(Document xmlDoc) throws BaseException
	{
		Node rootNode = xmlDoc.getDocumentElement();
		return getNodeAsMap(rootNode);
	}

	/**
	 * This method converts a Node into a Map representation. This uses a simple pattern of loading, the Name, Value,
	 * attributes and child elements as a set of Map having lists of content etc.
	 * 
	 * @param aNode The node to be converted to a Map representation
	 * @return A Map representation of the node.
	 * @throws BaseException Thrown if any error occurs while converting the Node to a map
	 */
	public static Map<String, Object> getNodeAsMap(Node aNode) throws BaseException
	{
		Map<String, Object> nodeDataMap = new HashMap<String, Object>();
		nodeDataMap.put(FIELD_NODE_KEY, aNode.getNodeName());
		nodeDataMap.put(FIELD_NODE_VALUE, aNode.getNodeValue());
		nodeDataMap.put(FIELD_NODE_ATTRIBUTES, getAllAttributes(aNode));
		if (aNode.hasChildNodes())
		{
			NodeList childrenList = aNode.getChildNodes();
			List<Map<String, Object>> childrenData = new ArrayList<Map<String, Object>>();
			nodeDataMap.put(FIELD_CHILDREN, childrenData);
			int numChildren = childrenList.getLength();
			for (int counter = 0; counter < numChildren; counter++)
			{
				childrenData.add(getNodeAsMap(childrenList.item(counter)));
			}
		}
		return nodeDataMap;
	}

}
