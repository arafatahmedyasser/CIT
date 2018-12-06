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
package com.intellectdesign.canvas.audit.handler;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.xerces.dom.DocumentImpl;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * This is the formatter used for formatting audit data in XML format
 * 
 * @version 1.0
 */
public class AuditDataXMLFormatter implements IAuditOutputFormatter
{
	private boolean auditOldValues;
	private Document xmlDoc = null;
	private Element root = null;
	private static final PropertyReader PROPS = AuditConstants.EVENT_PROP_READER;
	private static String[][] ESCAPE_CHAR_MAP;
	private static String[][] UNESCAPE_CHAR_MAP;

	private static final String ELEMENT_ROOT = PROPS.retrieveProperty(AuditConstants.ROOT_ELEMENT_NAME);
	private static final String ELEMENT_FIELD = PROPS.retrieveProperty(AuditConstants.ELEM_FIELD);
	private static final String ATTR_ROOT_OLD = PROPS.retrieveProperty("XML_ROOT_ATTR_OLD");
	private static final String ATTR_FIELD_NAME = PROPS.retrieveProperty("ATTR_FIELD_NAME");
	private static final String ATTR_MODIFIED = PROPS.retrieveProperty("ATTR_MODIFIED");
	private static final String ATTR_TYPE = PROPS.retrieveProperty("ATTR_TYPE");
	private static final String ATTR_LEVEL = PROPS.retrieveProperty("ATTR_LEVEL");
	private static final String ATTR_OLD_VALUE = PROPS.retrieveProperty("ATTR_OLD_VALUE");
	private static final String ATTR_NEW_VALUE = PROPS.retrieveProperty("ATTR_NEW_VALUE");
	private static final String ATTR_OLD_COUNT = PROPS.retrieveProperty("ATTR_OLD_COUNT");
	private static final String ATTR_NEW_COUNT = PROPS.retrieveProperty("ATTR_NEW_COUNT");
	private static final String ATTR_NUM_ADDITIONS = PROPS.retrieveProperty("ATTR_NUM_ADDITIONS");
	private static final String ATTR_NUM_DELETIONS = PROPS.retrieveProperty("ATTR_NUM_DELETIONS");
	private static final String ATTR_NUM_MODIFICATIONS = PROPS.retrieveProperty("ATTR_NUM_MODIFICATIONS");
	private static final String TEXT_FORMAT_KEY_VALUE_DELIMITER = PROPS.retrieveProperty("FORMAT_KEY_VALUE_DELIMITER");
	private static final String TEXT_NO_VALUE_PLACEHOLDER = PROPS.retrieveProperty("NEW_TXT_NO_VALUE_PLACEHOLDER");
	private static final String TEXT_MODIFIED_TEXT_FORMAT = PROPS.retrieveProperty("NEW_TXT_MODIFIED_TEXT_FORMAT");
	private static final String HANDLE_LEVEL_IN_FORMAT = PROPS.retrieveProperty("NEW_TXT_HANDLE_LEVEL_IN_FORMAT_IND");
	private static final String VALUE_PLACEHOLDER = "${VALUE}";

	static
	{
		// Initialize the escape character list for XML.
		ESCAPE_CHAR_MAP = new String[][]
		{
		{ "&", "&amp;" },
		{ "\"", "&quot;" },
		{ "<", "&lt;" },
		{ ">", "&gt;" },
		{ "'", "&apos;" } };

		// Initialize the unescape character list. This is useful for doing the reverse of parsing the XML.
		UNESCAPE_CHAR_MAP = reverse(flip(ESCAPE_CHAR_MAP));
	}

	/**
	 * Helper method to reverse a map where the values become the key.
	 * 
	 * @param input
	 * @return newarray
	 */
	private static String[][] flip(String[][] input)
	{
		String[][] newarray = new String[input.length][2];
		for (int i = 0; i < input.length; i++)
		{
			newarray[i][0] = input[i][1];
			newarray[i][1] = input[i][0];
		}
		return newarray;
	}

	/**
	 * Returns the array that is reversed (last row -> first row)
	 * 
	 * @param input
	 * @return newarray
	 */
	private static String[][] reverse(String[][] input)
	{
		String[][] newarray = new String[input.length][2];
		int j = 0;
		for (int i = input.length - 1; i >= 0; i--)
		{
			newarray[j][0] = input[i][1];
			newarray[j][1] = input[i][0];
			j++;
		}
		return newarray;
	}

	/**
	 * Helper method that replaces the characters present as Key in the CharMap with the corresponding values within the
	 * input.
	 * 
	 * @param input The input string
	 * @param charMap The replacement map
	 * @return The converted string
	 */
	private static String translate(String input, String[][] charMap)
	{
		String compareKey;
		String replaceValue;
		int index;
		String result = input;
		StringBuffer sb = new StringBuffer();
		String temp;
		for (int i = 0; i < charMap.length; i++)
		{
			compareKey = charMap[i][0];
			replaceValue = charMap[i][1];
			sb.setLength(0);
			while ((index = result.indexOf(compareKey)) != -1)
			{
				temp = result.substring(0, index);
				sb.append(temp).append(replaceValue);
				result = result.substring(index + compareKey.length());
			}
			result = sb.append(result).toString();
		}
		return result;
	}

	/**
	 * Constructor for AuditDataXMLFormatter
	 * 
	 */
	public AuditDataXMLFormatter()
	{
	}

	/**
	 * This method iterates through the list provided and converts it into the XML format
	 * 
	 * @param auditMetricsList
	 * @param auditConfig
	 * @param shouldAuditOldValues
	 * @return getDataAsString
	 * @throws AuditHandlerException
	 */
	public String format(List<AuditFieldMetrics> auditMetricsList, AuditDataValue auditConfig,
			boolean shouldAuditOldValues) throws AuditHandlerException
	{
		xmlDoc = new DocumentImpl();
		root = xmlDoc.createElement(ELEMENT_ROOT);
		xmlDoc.appendChild(root);
		setAuditOldValues(shouldAuditOldValues);
		root.setAttribute(ATTR_ROOT_OLD, convertToString(shouldAuditOldValues));

		if (auditMetricsList != null && auditMetricsList.size() > 0)
		{
			Iterator<AuditFieldMetrics> metricsIterator = auditMetricsList.iterator();
			AuditFieldMetrics aMetric;
			while (metricsIterator.hasNext())
			{
				aMetric = metricsIterator.next();
				// Simple null checks to ensure no bad things happen
				if (aMetric == null)
					continue;
				// Format the metric with the root
				format(aMetric, root);
			}
		}

		return getDataAsString();
	}

	/**
	 * This method will be called by the report generation to check whether the audited content can be parsed
	 * 
	 * @param content
	 * @return boolean
	 */
	public boolean canParse(String content)
	{
		// We can check if the content can be parsed by checking if the content starts with "<audit>", the root element.
		String startElement = "<" + ELEMENT_ROOT;
		return content.startsWith(startElement);
	}

	/**
	 * This method will be called by the report generation to parse the audited content as per the mode provided
	 * 
	 * @param content The content to be parsed
	 * @param format The format in which the parsed content is to be provided
	 * @param mode The mode indicating whether old and new values or both are to be retrieved
	 * @return Map containing the various aspects parsed from the content
	 * @throws AuditHandlerException Thrown if any error occurs while parsing the content
	 */
	public Map<String, Object> parse(String content, ParseOutputFormat format, ParseOutputMode mode)
			throws AuditHandlerException
	{
		Map<String, Object> parsedMap = new HashMap<String, Object>();

		switch (format)
		{
		case HTML:
			String outputString = parseAsHTML(content);
			parsedMap.put("NEW_VALUES", outputString);
			break;
		case TEXT:
			Object[] oldNewValues = parseAsText(content, mode);
			parsedMap.put("OLD_VALUES", oldNewValues[0]);
			parsedMap.put("NEW_VALUES", oldNewValues[1]);
			break;
		case FIELDS_LIST:
			Object[] fieldsList = parseAsFieldsList(content, mode);
			parsedMap.put("OLD_VALUES", fieldsList[0]);
			parsedMap.put("NEW_VALUES", fieldsList[1]);
			break;
		default:
			// It is the old format. Set the result in the key that this is unparseable.
			parsedMap.put("UNPARSED_CONTENT", content);
		}
		return parsedMap;
	}

	/**
	 * Helper method that parses the XML content into old and new values into parallel lists. If the new value is
	 * modified, then it is prefixed with a "* "
	 * 
	 * @param content
	 * @param mode
	 * @return new ArrayList[] (old and new values)
	 * @throws AuditHandlerException
	 */
	private Object[] parseAsFieldsList(String content, ParseOutputMode mode) throws AuditHandlerException
	{
		ArrayList oldValues = new ArrayList();
		ArrayList newValues = new ArrayList();
		boolean oldValuesAvailable = false;
		boolean recordOldValues = true;
		boolean recordNewValues = true;
		NodeList temp = null;
		Node rootNode = null;
		switch (mode)
		{
		case NEW_VALUES_ONLY:
			recordOldValues = false;
			break;
		case OLD_VALUES_ONLY:
			recordNewValues = false;
			break;
		case OLD_AND_NEW_VALUES:
			// Nothing to do as the boolean initializations are defaulted to this mode.
			break;
		default:
			break;
		}

		try
		{
			// Load the contents of the XML into a DOM model
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			InputSource is = new InputSource(new StringReader(content));
			Document doc = dBuilder.parse(is);
			// Normalize the document. Not that this will be really needed as we created the document. But still
			doc.getDocumentElement().normalize();
			temp = doc.getElementsByTagName(ELEMENT_ROOT);
			rootNode = temp.item(0);
			if (rootNode.getNodeType() != Node.ELEMENT_NODE)
			{
				throw new AuditHandlerException("AUDERR", "Root node of the XML is not a valid element");
			}
			oldValuesAvailable = "Y".equals(((Element) rootNode).getAttribute(ATTR_ROOT_OLD));
			// Now iterate through the content to retrieve the values.
			temp = rootNode.getChildNodes();// The child nodes will be field nodes only.
			Element fieldNode;
			for (int index = 0; index < temp.getLength(); index++)
			{
				fieldNode = (Element) temp.item(index);
				parseField(fieldNode, oldValues, newValues, recordOldValues, recordNewValues, oldValuesAvailable);
			}
		} catch (ParserConfigurationException e)
		{
			LOGGER.cterror("CTAUD00122", e);
			throw new AuditHandlerException("AUDERR", e);
		} catch (SAXException e)
		{
			LOGGER.cterror("CTAUD00123", e);
			throw new AuditHandlerException("AUDERR", e);
		} catch (IOException e)
		{
			LOGGER.cterror("CTAUD00124", e);
			throw new AuditHandlerException("AUDERR", e);
		}
		return new ArrayList[]
		{ oldValues, newValues };
	}

	/**
	 * Helper method that parses a field and delegates based on the field type
	 * 
	 * @param aNode The node to be parsed
	 * @param oldValues Old content aggregating buffer
	 * @param newValues New content aggregating buffer
	 * @param recordOldValues Flag indicating whether old values is to be collated
	 * @param recordNewValues Flag indicating whether new values is to be collated
	 * @param oldValuesAvailable
	 * @throws AuditHandlerException Thrown if any error occurs while parsing the node
	 */
	private void parseField(Element aNode, ArrayList oldValues, ArrayList newValues, boolean recordOldValues,
			boolean recordNewValues, boolean oldValuesAvailable) throws AuditHandlerException
	{
		// Handle by the type of field.
		String fieldType = aNode.getAttribute(ATTR_TYPE);
		if ("F".equals(fieldType))
		{
			parseSimpleField(aNode, oldValues, newValues, recordOldValues, recordNewValues, oldValuesAvailable);
		} else if ("L".equals(fieldType))
		{
			parseListField(aNode, oldValues, newValues, recordOldValues, recordNewValues, oldValuesAvailable);
		} else if ("M".equals(fieldType))
		{
			parseMapField(aNode, oldValues, newValues, recordOldValues, recordNewValues, oldValuesAvailable);
		} else
		{
			// Skip this node as we are not aware of this type. Log the same for triaging purposes
			LOGGER.cterror("CTAUD00125", fieldType, aNode);
		}
	}

	/**
	 * Helper method to parse a simple field node and add it into the old and new values bucket.
	 * 
	 * @param aNode
	 * @param oldValues
	 * @param newValues
	 * @param recordOldValues Flag indicating whether old values is to be collated
	 * @param recordNewValues Flag indicating whether new values is to be collated
	 * @param oldValuesAvailable
	 * @throws AuditHandlerException
	 */
	private void parseSimpleField(Element aNode, ArrayList oldValues, ArrayList newValues, boolean recordOldValues,
			boolean recordNewValues, boolean oldValuesAvailable) throws AuditHandlerException
	{
		String fieldName = unEscapeXML(aNode.getAttribute(ATTR_FIELD_NAME));
		String oldValue = unEscapeXML(aNode.getAttribute(ATTR_OLD_VALUE));
		String newValue = unEscapeXML(aNode.getAttribute(ATTR_NEW_VALUE));
		if (recordOldValues && oldValuesAvailable)
		{
			if (!"".equals(fieldName.trim()))
				oldValue = fieldName + TEXT_FORMAT_KEY_VALUE_DELIMITER + oldValue;
			oldValues.add(oldValue);
		} else
		{
			oldValues.add("");
		}
		if (recordNewValues)
		{
			if (!"".equals(fieldName.trim()))
				newValue = fieldName + TEXT_FORMAT_KEY_VALUE_DELIMITER + newValue;
			newValues.add(handledModifiedData(newValue, isModified(aNode)));
		}
	}

	/**
	 * Helper method to parse a map field node and add it into the old and new values bucket.
	 * 
	 * @param aNode
	 * @param oldValues
	 * @param newValues
	 * @param recordOldValues Flag indicating whether old values is to be collated
	 * @param recordNewValues Flag indicating whether new values is to be collated
	 * @param oldValuesAvailable
	 * @throws AuditHandlerException
	 */
	private void parseMapField(Element aNode, ArrayList oldValues, ArrayList newValues, boolean recordOldValues,
			boolean recordNewValues, boolean oldValuesAvailable) throws AuditHandlerException
	{
		String fieldName = aNode.getAttribute(ATTR_FIELD_NAME);
		if (recordOldValues && oldValuesAvailable)
		{
			oldValues.add(fieldName);
		} else
		{
			oldValues.add("");
		}
		if (recordNewValues)
		{
			newValues.add(fieldName);
		}
		// Now iterate through the child nodes and handle the same.
		NodeList childNodes = aNode.getChildNodes();
		for (int index = 0; index < childNodes.getLength(); index++)
		{
			parseField((Element) childNodes.item(index), oldValues, newValues, recordOldValues, recordNewValues,
					oldValuesAvailable);
		}
	}

	/**
	 * Helper method to parse a List field node and add it into the old and new values bucket.
	 * 
	 * @param aNode
	 * @param oldValues
	 * @param newValues
	 * @param recordOldValues Flag indicating whether old values is to be collated
	 * @param recordNewValues Flag indicating whether new values is to be collated
	 * @param oldValuesAvailable
	 * @throws AuditHandlerException
	 */
	private void parseListField(Element aNode, ArrayList oldValues, ArrayList newValues, boolean recordOldValues,
			boolean recordNewValues, boolean oldValuesAvailable) throws AuditHandlerException
	{
		String fieldName = aNode.getAttribute(ATTR_FIELD_NAME);
		String oldCountVal = aNode.getAttribute(ATTR_OLD_COUNT);
		String newCountVal = aNode.getAttribute(ATTR_NEW_COUNT);
		if (recordOldValues && oldValuesAvailable)
		{
			oldValues.add(fieldName + TEXT_FORMAT_KEY_VALUE_DELIMITER + oldCountVal);
		} else
		{
			oldValues.add("");
		}
		if (recordNewValues)
		{
			newValues.add(fieldName + TEXT_FORMAT_KEY_VALUE_DELIMITER
					+ handledModifiedData(newCountVal, isModified(aNode)));
		}
		// Now iterate through the child nodes and handle the same.
		NodeList childNodes = aNode.getChildNodes();
		for (int index = 0; index < childNodes.getLength(); index++)
		{
			parseField((Element) childNodes.item(index), oldValues, newValues, recordOldValues, recordNewValues,
					oldValuesAvailable);
		}
	}

	/**
	 * Helper method that parses the XML content into old and new values as a text format.
	 * 
	 * @param content
	 * @param mode
	 * @return new String[] (old and new content)
	 * @throws AuditHandlerException
	 */
	private Object[] parseAsText(String content, ParseOutputMode mode) throws AuditHandlerException
	{
		StringBuffer oldContent = new StringBuffer();
		StringBuffer newContent = new StringBuffer();
		boolean oldValuesAvailable = false;
		boolean recordOldValues = true;
		boolean recordNewValues = true;
		NodeList temp = null;
		Node rootNode = null;
		switch (mode)
		{
		case NEW_VALUES_ONLY:
			recordOldValues = false;
			break;
		case OLD_VALUES_ONLY:
			recordNewValues = false;
			break;
		case OLD_AND_NEW_VALUES:
			break;
		default:
			break;
		}

		try
		{
			// Load the contents of the XML into a DOM model
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			InputSource is = new InputSource(new StringReader(content));
			Document doc = dBuilder.parse(is);
			// Normalize the document. Not that this will be really needed as we created the document. But still
			doc.getDocumentElement().normalize();
			temp = doc.getElementsByTagName(ELEMENT_ROOT);
			rootNode = temp.item(0);
			if (rootNode.getNodeType() != Node.ELEMENT_NODE)
			{
				throw new AuditHandlerException("AUDERR", "Root node of the XML is not a valid element");
			}
			oldValuesAvailable = "Y".equals(((Element) rootNode).getAttribute(ATTR_ROOT_OLD));
			// Adjust the recordOldValues flag based on whether the XML says it has old values.
			recordOldValues = recordOldValues && oldValuesAvailable;
			// Now iterate through the content to retrieve the values.
			temp = rootNode.getChildNodes();// The child nodes will be field nodes only.
			Element fieldNode;
			for (int index = 0; index < temp.getLength(); index++)
			{
				fieldNode = (Element) temp.item(index);
				parseField(fieldNode, oldContent, newContent, recordOldValues, recordNewValues);
			}
		} catch (ParserConfigurationException e)
		{
			LOGGER.cterror("CTAUD00126", e);
			throw new AuditHandlerException("AUDERR", e);
		} catch (SAXException e)
		{
			LOGGER.cterror("CTAUD00127", e);
			throw new AuditHandlerException("AUDERR", e);
		} catch (IOException e)
		{
			LOGGER.cterror("CTAUD00128", e);
			throw new AuditHandlerException("AUDERR", e);
		}
		return new String[]
		{ oldContent.toString(), newContent.toString() };
	}

	/**
	 * Helper method that parses a field and delegates based on the field type
	 * 
	 * @param aNode The node to be parsed
	 * @param oldContent Old content aggregating buffer
	 * @param newContent New content aggregating buffer
	 * @param recordOldValues Flag indicating whether old values is to be collated
	 * @param recordNewValues Flag indicating whether new values is to be collated
	 * @throws AuditHandlerException Thrown if any error occurs while parsing the node
	 */
	private void parseField(Element aNode, StringBuffer oldContent, StringBuffer newContent, boolean recordOldValues,
			boolean recordNewValues) throws AuditHandlerException
	{
		// Handle by the type of field.
		String fieldType = aNode.getAttribute(ATTR_TYPE);
		if ("F".equals(fieldType))
		{
			parseSimpleField(aNode, oldContent, newContent, recordOldValues, recordNewValues);
		} else if ("L".equals(fieldType))
		{
			parseListField(aNode, oldContent, newContent, recordOldValues, recordNewValues);
		} else if ("M".equals(fieldType))
		{
			parseMapField(aNode, oldContent, newContent, recordOldValues, recordNewValues);
		} else
		{
			// Skip this node as we are not aware of this type. Log the same for triaging purposes
			LOGGER.cterror("CTAUD00129", fieldType, aNode);
		}
	}

	/**
	 * Helper method to parse a simple field node and add it into the old and new values bucket.
	 * 
	 * @param aNode
	 * @param oldContent
	 * @param newContent
	 * @param recordOldValues
	 * @param recordNewValues
	 * @throws AuditHandlerException
	 */
	private void parseSimpleField(Element aNode, StringBuffer oldContent, StringBuffer newContent,
			boolean recordOldValues, boolean recordNewValues) throws AuditHandlerException
	{
		String fieldName = unEscapeXML(aNode.getAttribute(ATTR_FIELD_NAME));
		String oldValue = unEscapeXML(aNode.getAttribute(ATTR_OLD_VALUE));
		String newValue = unEscapeXML(aNode.getAttribute(ATTR_NEW_VALUE));
		String levelVal = aNode.getAttribute(ATTR_LEVEL);
		int level = Integer.valueOf(levelVal);
		String prefix = "";
		if ("Y".equals(HANDLE_LEVEL_IN_FORMAT))
		{
			for (int count = 0; count < level; count++)
				prefix = prefix + "\t";
		}
		if (recordOldValues)
		{
			oldContent.append(prefix).append(fieldName).append(TEXT_FORMAT_KEY_VALUE_DELIMITER).append(oldValue)
					.append("\n");
		}
		if (recordNewValues)
		{
			newContent.append(prefix).append(fieldName).append(TEXT_FORMAT_KEY_VALUE_DELIMITER)
					.append(handledModifiedData(newValue, isModified(aNode))).append("\n");
		}
	}

	/**
	 * Helper method to parse a simple field node and add it into the old and new values bucket.
	 * 
	 * @param aNode
	 * @param oldContent
	 * @param newContent
	 * @param recordOldValues
	 * @param recordNewValues
	 * @throws AuditHandlerException
	 */
	private void parseMapField(Element aNode, StringBuffer oldContent, StringBuffer newContent,
			boolean recordOldValues, boolean recordNewValues) throws AuditHandlerException
	{
		String fieldName = aNode.getAttribute(ATTR_FIELD_NAME);
		String levelVal = aNode.getAttribute(ATTR_LEVEL);
		int level = Integer.valueOf(levelVal);
		String prefix = "";
		if ("Y".equals(HANDLE_LEVEL_IN_FORMAT))
		{
			for (int count = 0; count < level; count++)
				prefix = prefix + "\t";
		}
		if (recordOldValues)
		{
			oldContent.append(prefix).append(fieldName).append(TEXT_FORMAT_KEY_VALUE_DELIMITER).append("\n");
		}
		if (recordNewValues)
		{
			newContent.append(prefix).append(fieldName).append(TEXT_FORMAT_KEY_VALUE_DELIMITER).append("\n");
		}
		// Now iterate through the child nodes and handle the same.
		NodeList childNodes = aNode.getChildNodes();
		for (int index = 0; index < childNodes.getLength(); index++)
		{
			parseField((Element) childNodes.item(index), oldContent, newContent, recordOldValues, recordNewValues);
		}
	}

	/**
	 * Helper method to parse a simple field node and add it into the old and new values bucket.
	 * 
	 * @param aNode
	 * @param oldContent
	 * @param newContent
	 * @param recordOldValues
	 * @param recordNewValues
	 * @throws AuditHandlerException
	 */
	private void parseListField(Element aNode, StringBuffer oldContent, StringBuffer newContent,
			boolean recordOldValues, boolean recordNewValues) throws AuditHandlerException
	{
		String fieldName = aNode.getAttribute(ATTR_FIELD_NAME);
		String levelVal = aNode.getAttribute(ATTR_LEVEL);
		int level = Integer.valueOf(levelVal);
		String oldCountVal = aNode.getAttribute(ATTR_OLD_COUNT);
		String newCountVal = aNode.getAttribute(ATTR_NEW_COUNT);
		String prefix = "";
		if ("Y".equals(HANDLE_LEVEL_IN_FORMAT))
		{
			for (int count = 0; count < level; count++)
				prefix = prefix + "\t";
		}
		if (recordOldValues)
		{
			oldContent.append(prefix).append(fieldName).append(TEXT_FORMAT_KEY_VALUE_DELIMITER).append(oldCountVal)
					.append("\n");
		}
		if (recordNewValues)
		{
			newContent.append(prefix).append(fieldName).append(TEXT_FORMAT_KEY_VALUE_DELIMITER)
					.append(handledModifiedData(newCountVal, isModified(aNode))).append("\n");
		}
		// Now iterate through the child nodes and handle the same.
		NodeList childNodes = aNode.getChildNodes();
		for (int index = 0; index < childNodes.getLength(); index++)
		{
			parseField((Element) childNodes.item(index), oldContent, newContent, recordOldValues, recordNewValues);
		}
	}

	/**
	 * Mehtod for checking aNode is modified or not
	 * 
	 * @param aNode
	 * @return if aNode is modified it returns true otherwise it returns false
	 */
	private boolean isModified(Element aNode)
	{
		String modifiedVal = aNode.getAttribute(ATTR_MODIFIED);
		return "Y".equals(modifiedVal);
	}

	/**
	 * Convert the value into the modified text format
	 * 
	 * @param aValue
	 * @param isModified
	 * @return retVal
	 */
	private String handledModifiedData(String aValue, boolean isModified)
	{
		String retVal = aValue;
		if (aValue == null || "".equals(aValue))
			retVal = TEXT_NO_VALUE_PLACEHOLDER;
		if (isModified)
		{
			int index = TEXT_MODIFIED_TEXT_FORMAT.indexOf(VALUE_PLACEHOLDER);
			if (index > -1)
			{
				retVal = TEXT_MODIFIED_TEXT_FORMAT.substring(0, index) + retVal
						+ TEXT_MODIFIED_TEXT_FORMAT.substring(index + VALUE_PLACEHOLDER.length());
			}
		}
		return retVal;
	}

	/**
	 * Helper method that converts the XML to a HTML as per the configured XSLT.
	 * 
	 * @param content The XML content
	 * @return The HTML string
	 * @throws AuditHandlerException Thrown if any error occurs while converting from XML to HTML
	 */
	private String parseAsHTML(String content) throws AuditHandlerException
	{
		NodeList temp = null;
		Node rootNode = null;
		HTMLOutputGenerator generator = null;
		String returnValue = null;
		try
		{
			// Load the contents of the XML into a DOM model
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			InputSource is = new InputSource(new StringReader(content));
			Document doc = dBuilder.parse(is);
			// Normalize the document. Not that this will be really needed as we created the document. But still
			doc.getDocumentElement().normalize();
			temp = doc.getElementsByTagName(ELEMENT_ROOT);
			rootNode = temp.item(0);
			if (rootNode.getNodeType() != Node.ELEMENT_NODE)
			{
				throw new AuditHandlerException("AUDERR", "Root node of the XML is not a valid element");
			}
			boolean oldValuesAvailable = "Y".equals(((Element) rootNode).getAttribute(ATTR_ROOT_OLD));
			// Adjust the recordOldValues flag based on whether the XML says it has old values.
			generator = new HTMLOutputGenerator(oldValuesAvailable);
			generator.startBody();
			// Now iterate through the content to retrieve the values.
			temp = rootNode.getChildNodes();// The child nodes will be field nodes only.
			Element fieldNode;
			for (int index = 0; index < temp.getLength(); index++)
			{
				fieldNode = (Element) temp.item(index);
				parseField(fieldNode, generator);
			}
			generator.endBody();
			returnValue = generator.toString();
		} catch (ParserConfigurationException e)
		{
			LOGGER.cterror("CTAUD00130", e);
			throw new AuditHandlerException("AUDERR", e);
		} catch (SAXException e)
		{
			LOGGER.cterror("CTAUD00131", e);
			throw new AuditHandlerException("AUDERR", e);
		} catch (IOException e)
		{
			LOGGER.cterror("CTAUD00132", e);
			throw new AuditHandlerException("AUDERR", e);
		}
		return returnValue;
	}

	/**
	 * This method is used to parse fields of HtmlOutputGenerator
	 * 
	 * @param node
	 * @param generator
	 * @throws AuditHandlerException
	 */
	private void parseField(Element node, HTMLOutputGenerator generator) throws AuditHandlerException
	{
		String fieldType = node.getAttribute(ATTR_TYPE);
		String strLevel = node.getAttribute(ATTR_LEVEL);
		int level = Integer.parseInt(strLevel);
		String strModified = node.getAttribute(ATTR_MODIFIED);
		boolean isModified = "Y".equals(strModified);
		String fieldName = node.getAttribute(ATTR_FIELD_NAME);
		String oldValue = "";
		String newValue = "";
		if ("F".equals(fieldType))
		{
			oldValue = node.getAttribute(ATTR_OLD_VALUE);
			newValue = node.getAttribute(ATTR_NEW_VALUE);
			generator.startField();
			generator.addRow(level, fieldName, oldValue, newValue, isModified);
			generator.endField();
		} else if ("M".equals(fieldType))
		{
			generator.startCollectionMap();
			generator.addRow(level, fieldName, "", "", isModified);
			// Iterate through the children and process the same.
			NodeList childNodes = node.getChildNodes();
			for (int index = 0; index < childNodes.getLength(); index++)
			{
				parseField((Element) childNodes.item(index), generator);
			}
			generator.endCollectionMap();
		} else if ("L".equals(fieldType))
		{
			generator.startCollectionList();
			oldValue = node.getAttribute(ATTR_OLD_COUNT);
			newValue = node.getAttribute(ATTR_NEW_COUNT);
			generator.addRow(level, fieldName, oldValue, newValue, isModified);
			// Iterate through the children and process the same.
			NodeList childNodes = node.getChildNodes();
			for (int index = 0; index < childNodes.getLength(); index++)
			{
				parseField((Element) childNodes.item(index), generator);
			}
			generator.endCollectionList();
		}
	}

	/**
	 * Helper method to format a metric and add it to the parent
	 * 
	 * @param aMetric
	 * @param parent
	 */
	protected void format(AuditFieldMetrics aMetric, Element parent)
	{
		if ("F".equals(aMetric.getType()))
			formatAField(aMetric, parent);
		else if ("L".equals(aMetric.getType()))
			formatAList(aMetric, parent);
		else if ("M".equals(aMetric.getType()))
			formatAMap(aMetric, parent);
		else
		{
			LOGGER.cterror("CTAUD00133", aMetric);
		}
	}

	/**
	 * Format the metric as a simple field data. If it could not format, it returns false.
	 * 
	 * @param fieldMetric The metric to be formatted
	 * @param parent
	 */
	protected void formatAField(AuditFieldMetrics fieldMetric, Element parent)
	{
		Element fieldElement = xmlDoc.createElement(ELEMENT_FIELD);
		fieldElement.setAttribute(ATTR_FIELD_NAME, escapeXML(fieldMetric.getName()));
		fieldElement.setAttribute(ATTR_TYPE, fieldMetric.getType());
		fieldElement.setAttribute(ATTR_LEVEL, String.valueOf(fieldMetric.getLevel()));
		fieldElement.setAttribute(ATTR_MODIFIED, convertToString(fieldMetric.isModified()));
		fieldElement.setAttribute(ATTR_NEW_VALUE, escapeXML(fieldMetric.getNewValue()));
		if (isAuditOldValues())
			fieldElement.setAttribute(ATTR_OLD_VALUE, escapeXML(fieldMetric.getOldValue()));

		// Now that the element is created, add it to the parent.
		parent.appendChild(fieldElement);
	}

	/**
	 * Format the metric as a list data.
	 * 
	 * @param listMetric The metric to be formatted
	 * @param parent
	 */
	protected void formatAList(AuditFieldMetrics listMetric, Element parent)
	{
		AuditFieldCollectionMetrics collMetrics = (AuditFieldCollectionMetrics) listMetric;
		Element listElement = xmlDoc.createElement(ELEMENT_FIELD);
		listElement.setAttribute(ATTR_FIELD_NAME, escapeXML(collMetrics.getName()));
		listElement.setAttribute(ATTR_TYPE, collMetrics.getType());
		listElement.setAttribute(ATTR_LEVEL, String.valueOf(collMetrics.getLevel()));
		listElement.setAttribute(ATTR_MODIFIED, convertToString(collMetrics.isModified()));
		listElement.setAttribute(ATTR_OLD_COUNT, convertToString(collMetrics.getOldCount()));
		listElement.setAttribute(ATTR_NEW_COUNT, convertToString(collMetrics.getNewCount()));
		listElement.setAttribute(ATTR_NUM_ADDITIONS, convertToString(collMetrics.getNumAdditions()));
		listElement.setAttribute(ATTR_NUM_DELETIONS, convertToString(collMetrics.getNumDeletions()));
		listElement.setAttribute(ATTR_NUM_MODIFICATIONS, convertToString(collMetrics.getNumModifications()));
		// Iterate through the children and add the same to the current list element as parent.
		Iterator<AuditFieldMetrics> it = collMetrics.getChildren().iterator();
		while (it.hasNext())
		{
			format(it.next(), listElement);
		}

		// Now that the element is created, add it to the parent.
		parent.appendChild(listElement);
	}

	/**
	 * Tries to format the metric as a Map data.
	 * 
	 * @param mapMetric The metric to be formatted
	 * @param parent
	 */
	protected void formatAMap(AuditFieldMetrics mapMetric, Element parent)
	{
		AuditFieldCollectionMetrics collMetrics = (AuditFieldCollectionMetrics) mapMetric;

		Element mapElement = xmlDoc.createElement(ELEMENT_FIELD);
		mapElement.setAttribute(ATTR_FIELD_NAME, escapeXML(collMetrics.getName()));
		mapElement.setAttribute(ATTR_TYPE, collMetrics.getType());
		mapElement.setAttribute(ATTR_LEVEL, String.valueOf(collMetrics.getLevel()));
		mapElement.setAttribute(ATTR_MODIFIED, convertToString(collMetrics.isModified()));
		// Iterate through the children and add the same to the current map element as parent.
		Iterator<AuditFieldMetrics> it = collMetrics.getChildren().iterator();
		while (it.hasNext())
		{
			format(it.next(), mapElement);
		}

		// Now that the element is created, add it to the parent.
		parent.appendChild(mapElement);
	}

	/**
	 * Helper method to convert a Boolean value to Y or N depending on whether it is true or false.
	 * 
	 * @param aVal
	 * @return String
	 */
	private String convertToString(boolean aVal)
	{
		return aVal ? "Y" : "N";
	}

	/**
	 * Helper method to convert a Integer value to a String
	 * 
	 * @param aVal
	 * @return String
	 */
	private String convertToString(int aVal)
	{
		return String.valueOf(aVal);
	}

	/**
	 * Helper method to ensure that the data being inserted into XML does not contain any XML reserved special
	 * characters.
	 * 
	 * @param srcData
	 * @return String
	 */
	private String escapeXML(String srcData)
	{
		if (srcData != null && !"".equals(srcData.trim()))
			return translate(srcData, ESCAPE_CHAR_MAP);
		else
			return "";
	}

	/**
	 * Helper method to ensure that any escaped data in the string is reverted back to the original state. characters.
	 * 
	 * @param srcData
	 * @return String
	 */
	private String unEscapeXML(String srcData)
	{
		return translate(srcData, UNESCAPE_CHAR_MAP);
	}

	/**
	 * return as document
	 * 
	 * @return String as document
	 */
	protected String getDataAsString()
	{
		TransformerFactory factory = TransformerFactory.newInstance();
		StringWriter writer = new StringWriter();
		try
		{
			Transformer aTransformer = factory.newTransformer();
			try
			{
				aTransformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
			} catch (IllegalArgumentException e)
			{
				LOGGER.cterror("CTAUD00134", e);
			}
			aTransformer.transform(new DOMSource(this.xmlDoc), new StreamResult(writer));
		} catch (TransformerConfigurationException e)
		{
			LOGGER.cterror("CTAUD00135", e);
		} catch (TransformerException e)
		{
			LOGGER.cterror("CTAUD00136", e);
		}
		return writer.getBuffer().toString();
	}

	/**
	 * This method is used to set auditOldValues
	 * 
	 * @param auditOldValues the auditOldValues to set
	 */
	protected void setAuditOldValues(boolean auditOldValues)
	{
		this.auditOldValues = auditOldValues;
	}

	/**
	 * This method is used check AuditOLdVAlues
	 * 
	 * @return the auditOldValues
	 */
	protected boolean isAuditOldValues()
	{
		return auditOldValues;
	}

	private static final Logger LOGGER = Logger.getLogger(AuditDataXMLFormatter.class);
}
