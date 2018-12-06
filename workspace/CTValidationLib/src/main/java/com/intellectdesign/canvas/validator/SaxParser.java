/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.validator;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Vector;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;

import com.intellectdesign.canvas.logger.Logger;
/**
 *This class is for This class is used to parse the <<vertical>>.xml file to find the validation rules for given action.
 * 
 * @version 1.0
 */
public class SaxParser extends DefaultHandler implements Serializable
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -6748052138495629083L;
	private static Logger logger = Logger.getLogger(SaxParser.class);
	private Object $eVal[] = null;
	private ArrayList $list = new ArrayList();
	private ArrayList $addValue = null;
	private Vector vector = new Vector();
	private String $functionCode_Action = "";
	private boolean inName = false;
	private String fieldName = "";
	private String tempFunctionCode_Action = "";

	// It's collection flag. While parsing collection tag starts then this value
	// sets to 'collection'.At end of
	// collection tag parsing again sets to ""
	private String collection = "";
	// It's collFieldF flag. While parsing filedType tag sub tag of collection
	// tag starts then this value sets to
	// COLLECTION_FIELDTYPE.At end of filedType tag subtag of collection tag
	// parsing again sets to ""
	private String collectionFieldType = "";
	
	 // Used to set collection value to collField
	private static final String COLLECTION = "collection";
	private static final String FIELD_TYPE = "fieldType";
	
	// Used to set COLLECTION_FIELDTYPE value to collField
	private static final String COLLECTION_FIELDTYPE = "COLLECTION_FIELDTYPE"; 
	
	// The various attributes that will be read at each field level from the XML.
	private static final String ATTRIB_SIZE = "size";
	private static final String ATTRIB_BACKDATE = "backDate";
	private static final String ATTRIB_TYPE = "type";
	private static final String ATTRIB_MANDATORY = "mandatory";
	private static final String ATTRIB_SPECIAL_CHAR = "specialCharacter";
	private static final String ATTRIB_INCLUSIVE = "inclusive";
	private static final String ATTRIB_MULTILINE = "multiline";
	private static final String ATTRIB_MULTILANG = "multilang";
	private static final String ATTRIB_SUPPORTED_LANGS = "langId";
	private static final String ATTRIB_RESTRICT_LANG_KEY = "restrictLangId";
	private CollectionElementsValue collValue;

	/**
	 * Default Constructor does nothing
	 */
	SaxParser()
	{
	}

	/**
	 * The <code>process</code> The file will be parsed based event, the event wil fire for each node and the character
	 * method will be called for text value.
	 * 
	 * @param String fileName
	 * @param String $vType -Combination of function code and action, For instance function code value is VIEW and
	 *            action value is SEARCH_ACTION then vtype value would VIEW_SEARCH_ACTION
	 * @return ArrayList
	 * @exception ValidationException If any exception arises during the validation operation
	 */
	public ArrayList parseXml(String fileName, String vType) throws ValidationException
	{
		String cmName = "SaxParser.parseXml";
		String fieldKey = fileName + ".xml";

		InputStream is = null;

		try
		{
			$addValue = new ArrayList();
			SAXParserFactory spf = SAXParserFactory.newInstance();
			spf.setValidating(false);
			SAXParser saxParser = spf.newSAXParser();
			XMLReader reader = saxParser.getXMLReader();

			is = SaxParser.class.getClassLoader().getResourceAsStream(fieldKey);
			$functionCode_Action = vType;
			reader.setContentHandler(this);
			reader.parse(new InputSource(is));
		} catch (Exception exp)
		{
			logger.cterror("CTVAL00025", exp, cmName, fieldKey, fieldKey);
			throw new ValidationException("Problem Parsing XML file");
		}

		finally
		{
			try
			{
				if (is != null)
					is.close();
			} catch (IOException e)
			{
				logger.cterror("CTVAL00046", e, cmName);
			}
		}
		return $addValue;
	}

	/**
	 * ref to Start Docs parsexml
	 * 
	 * @see org.xml.sax.helpers.DefaultHandler.startDocument()
	 */
	public void startDocument()
	{
	}

	/**
	 * Receive notification of the start of an element. By default, do nothing. Application writers may override this
	 * method in a subclass to take specific actions at the start of each element (such as allocating a new tree node or
	 * writing output to a file).
	 * 
	 * @param nameSpaceURI - the Namespace URI and local name are required when the namespaces property is true (the
	 *            default), and are optional when the namespaces property is false (if one is specified, both must be);
	 *            the qualified name is required when the namespace-prefixes property is true, and is optional when the
	 *            namespace-prefixes property is false (the default).
	 * @param attributes - The specified or defaulted attributes.
	 * @param localName - The local name (without prefix), or the empty string if Namespace processing is not being
	 *            performed.
	 * @param qName - The qualified name (with prefix), or the empty string if qualified names are not available.
	 * @see org.xml.sax.helpers.DefaultHandler.startElement()
	 */
	public void startElement(String nameSpaceURI, String localName, String qName, Attributes attributes)
			throws SAXException
	{

		String localefunctionCode_Action = $functionCode_Action;
		String localeQname = qName;

		if (!"".equals(tempFunctionCode_Action) && tempFunctionCode_Action.equals(localefunctionCode_Action))
			localeQname = tempFunctionCode_Action;

		if (localefunctionCode_Action.equalsIgnoreCase(localeQname))
		{

			// if Collection tag parsing starts then
			// setting 'collection' to this.collection and setting collection
			// tag name and mandatory value
			if (COLLECTION.equalsIgnoreCase(qName))
			{
				setCollection(qName.toLowerCase());
				collValue = new CollectionElementsValue();
				collValue.setCollectionName(attributes.getValue(0));

				Boolean boolOb = Boolean.valueOf(attributes.getValue(1));
				collValue.setMandatory(boolOb.booleanValue());

			}
			// If 'collection' is sub tag of function_action tag
			if (collection.equals(COLLECTION))
			{
				// If 'fieldType' is sub tag of 'collection' tag then setting
				// value 'filedType' to this.collectionFieldType
				// and calling stroreElementValue()
				if (FIELD_TYPE.equals(qName))
				{
					setCollectionFieldType(COLLECTION_FIELDTYPE);
					storeElementValue(attributes);

				}
			} else if (FIELD_TYPE.equals(qName))// If fieldType is sub tag of
			// action then calling
			// storeElementVale()
			{
				storeElementValue(attributes);
			}

			tempFunctionCode_Action = localefunctionCode_Action;

		}

	}

	/**
	 * This method sets validation rules to ElementValue and adds ElementValue to vector
	 * 
	 * @param Attributes
	 */
	private void storeElementValue(Attributes attrs)
	{

		inName = true;

		String fieldLength = attrs.getValue(ATTRIB_SIZE);
		String dateCheck = attrs.getValue(ATTRIB_BACKDATE);

		ElementValue val = new ElementValue();

		val.setFieldType(attrs.getValue(ATTRIB_TYPE));
		val.setMandatory(attrs.getValue(ATTRIB_MANDATORY));
		val.setSpecialCharacter(attrs.getValue(ATTRIB_SPECIAL_CHAR));
		val.setInclusiveChars(attrs.getValue(ATTRIB_INCLUSIVE));
		val.setMultline(attrs.getValue(ATTRIB_MULTILINE));
		val.setMultiLang(attrs.getValue(ATTRIB_MULTILANG));
		val.setRestrictLangKey(attrs.getValue(ATTRIB_RESTRICT_LANG_KEY));
		val.setLangIds(attrs.getValue(ATTRIB_SUPPORTED_LANGS));

		if (!"".equals(fieldLength) && fieldLength != null)
			val.setFieldLength(fieldLength);
		if (!"".equals(dateCheck) && dateCheck != null)
			val.setDateCheck(dateCheck);
		vector.add(val);

	}

	/**
	 * Receive notification of the end of an element. By default, do nothing. Application writers may override this
	 * method in a subclass to take specific actions at the end of each element (such as finalising a tree node or
	 * writing output to a file).
	 * 
	 * @param localName - The local name (without prefix), or the empty string if Namespace processing is not being
	 *            performed.
	 * @param qName - The qualified XML 1.0 name (with prefix), or the empty string if qualified names are not
	 *            available.
	 * @see org.xml.sax.helpers.DefaultHandler.endElement()
	 */
	public void endElement(String nameSpaceURI, String localName, String qName) throws SAXException
	{
		String ltype = $functionCode_Action;

		if (!"".equals(tempFunctionCode_Action) && ltype.equalsIgnoreCase(tempFunctionCode_Action))
		{

			if (collection.equalsIgnoreCase(qName))
			{
				setCollection("");
				$list.add(collValue);

			}
			// If 'fieldType' tag sub tag of collection tag parsing ends
			if (collectionFieldType.equals(COLLECTION_FIELDTYPE) && FIELD_TYPE.equals(qName))
			{

				setCollectionFieldType("");// collectionFieldType value
											// resetting to ""
				inName = false;
				ElementValue val = (ElementValue) vector.get(0);
				val.setFieldName(fieldName);
				collValue.addElementValueList(val);
				vector.remove(0);
			} else if (FIELD_TYPE.equals(qName))// If fieldType tag sub tag of
												// action tag parsing ends
			{

				inName = false;
				ElementValue val = (ElementValue) vector.get(0);
				val.setFieldName(fieldName);
				$list.add(val);
				vector.remove(0);
			}
		}
		// After parsing all validation rules for given action then
		// converting $list(collection of ElementValue/CollectionElementsValue)
		// to object array, adding object array to another list and clearing
		// $list
		if ($functionCode_Action.equalsIgnoreCase(qName))
		{

			$eVal = $list.toArray();
			$addValue.add($eVal);
			$list.clear();

		}
	}

	/**
	 * Receive notification of character data inside an element. Used to read chars between field star tag end tag, sets
	 * those chars as fieldName
	 * 
	 * @see org.xml.sax.helpers.DefaultHandler.characters
	 */
	public void characters(char buf[], int offset, int len)
	{
		String charValue = new String(buf, offset, len);
		if (inName)
			fieldName = charValue;

	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler.endDocument
	 */
	public void endDocument()
	{
	}

	/**
	 * Set value to this.collection when collection tag, sub tag of function_action tag, parsing starts/ends
	 * 
	 * @param collection - possible values are collection/""(empty string)
	 */
	public void setCollection(String collection)
	{
		this.collection = collection;
	}

	/**
	 * Set value to this.collectionFieldType when fileType tag, sub tag of collection tag, parsing starts/ends
	 * 
	 * @param collection - possible values are COLLECTION_FIELDTYPE/""(empty string)
	 */
	public void setCollectionFieldType(String collectionFieldType)
	{
		this.collectionFieldType = collectionFieldType;
	}

}
