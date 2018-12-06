/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.pref.date;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.w3c.dom.Node;

import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.spec.registry.CanvasRegistryBase;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.utils.XMLParser;

/**
 * DateFormatRegistry is a concrete class for register,unregister,replaceContent,lookup and Iterator of date formats
 * configuration only . This is the central registry for all date formats used within the Canvas Framework.
 * 
 * @Version 1.0
 */
public class DateFormatRegistry extends CanvasRegistryBase
{

	private List<ICanvasRegistryContent> dateFormatCache = null;
	private static final Logger LOGGER = Logger.getLogger(DateFormatRegistry.class);

	/**
	 * This method is used to DateFormatRegistry
	 * 
	 * @param indexr
	 */
	public DateFormatRegistry(ICanvasRegistryIndexer indexr)
	{
		super(indexr);
		dateFormatCache = new ArrayList<ICanvasRegistryContent>();
	}

	/**
	 * Creating the singleton instance holder class using the Solution of Bill Pugh to avoid concurrency initialization
	 * issues
	 */
	private static class DateFormatRegistryHolder
	{
		static final DateFormatRegistry INSTANCE = new DateFormatRegistry(new DateFormatIndexer());
	}

	/**
	 * This method returns the instance of the Registry. The registry is configured with indexer used by Canvas
	 * Framework
	 * 
	 * @return The instance of the DateFormatRegistry
	 */
	public static DateFormatRegistry getInstance()
	{
		return DateFormatRegistryHolder.INSTANCE;
	}

	/**
	 * This method register the Date Format
	 * 
	 * @param xmlConfigPath- it is the date formats configuration file (eg:canvas-dateformats.xml)
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(java.lang.String)
	 */
	public void register(String xmlConfigPath) throws BaseException
	{
		InputStream sourceData = null;
		XMLParser parser = null;
		try
		{
			sourceData = ResourceLoaderUtils.loadResource(xmlConfigPath);
			// If no exception has been encountered, then the resource was loaded successfully. So try to parse it into
			// an XML

			DateFormatConfig.DateFormatBuilder builder = null;
			parser = new XMLParser(sourceData);
			String dateId = null;
			String description = null;
			String formatterClass = null;
			String javaDateFormat = null;
			boolean canOverride = false;
			boolean enabled = true;
			int count = parser.getNodeCount("format");
			for (int i = 0; i < count; i++)
			{
				Node n = parser.getNode("format", i);
				dateId = XMLParser.getAttributeValueAtNode(n, "Id");
				description = XMLParser.getAttributeValueAtNode(n, "description");
				javaDateFormat = StringUtils.ensureExists(XMLParser.getAttributeValueAtNode(n, "javaDateFormat"),
						PreferenceConstants.DEFAULT_DATE_FORMAT);
				formatterClass = StringUtils.ensureExists(XMLParser.getAttributeValueAtNode(n, "formatter-class"),
						PreferenceConstants.DEFAULT_DATE_FORMATTERCLASS);
				canOverride = StringUtils.convertToBoolean(XMLParser.getAttributeValueAtNode(n, "canOverride"));
				// Assign default value is "true" to enabled attribute
				String temp = StringUtils.ensureExists(XMLParser.getAttributeValueAtNode(n, "isEnabled"), "true");
				enabled = StringUtils.convertToBoolean(temp);
				builder = new DateFormatConfig.DateFormatBuilder();
				builder.setDateId(dateId).setDescription(description).setJavaDateFormat(javaDateFormat)
						.setFormatterClass(formatterClass).setOverridable(canOverride).setEnabled(enabled);
				register(builder.build());
			}

		} catch (Exception e)
		{
			LOGGER.cterror("CTBAS00079", e);
			throw new BaseException(e);
		} finally
		{
			// Finally close the stream
			ResourceLoaderUtils.closeStream(sourceData);
			parser = null;
		}
	}

	/**
	 * this method registerImpl
	 * 
	 * @param aContent
	 * @return true|false
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registerImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean registerImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean regSuccess = false;
		if (aContent instanceof DateFormatConfig)
		{
			DateFormatConfig contentToAdd = (DateFormatConfig) aContent;
			dateFormatCache.add(contentToAdd);
			regSuccess = true;
		}
		return regSuccess;
	}

	/**
	 * this method register ReplaceContent
	 * 
	 * @param origContent
	 * @param aContent
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#replaceContent(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent,
	 *      com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected void replaceContent(ICanvasRegistryContent origContent, ICanvasRegistryContent aContent)
			throws BaseException
	{
		if (aContent instanceof DateFormatConfig && origContent instanceof DateFormatConfig)
		{
			DateFormatConfig contentToAdd = (DateFormatConfig) aContent;
			// Ideally the position does not matter as this has no bearing in DateFormatMap identification. So delete
			// the origContent and add the new content
			dateFormatCache.remove(origContent);
			dateFormatCache.add(contentToAdd);
		}
	}

	/**
	 * This methos register UnRegisterImpl
	 * 
	 * @param aContent
	 * @return true|false
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#unregisterImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean unregisterImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean unregSuccess = false;
		if (aContent instanceof DateFormatConfig)
		{
			DateFormatConfig contentToRemove = (DateFormatConfig) aContent;
			unregSuccess = dateFormatCache.remove(contentToRemove);
		}
		return unregSuccess;
	}

	/**
	 * This method register Iterator
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registryIterator()
	 */
	@Override
	public Iterator<ICanvasRegistryContent> registryIterator()
	{
		return dateFormatCache.iterator();
	}

}
