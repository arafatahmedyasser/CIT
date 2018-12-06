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
package com.intellectdesign.canvas.pref.amount;

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
 * AmountFormatRegistry is a concrete class for register,unregister,replaceContent,lookup and Iterator of amount formats
 * configuration only . This is the central registry for all amount formats used within the Canvas Framework.
 * 
 * 
 * @version 1.0
 */
public class AmountFormatRegistry extends CanvasRegistryBase
{
	private List<ICanvasRegistryContent> amountFormatCache = null;
	private static final Logger LOGGER = Logger.getLogger(AmountFormatRegistry.class);

	/**
	 * This method is used to AmountFormatRegistry
	 * 
	 * @param indexr
	 */
	AmountFormatRegistry(ICanvasRegistryIndexer indexr)
	{
		super(indexr);
		amountFormatCache = new ArrayList<ICanvasRegistryContent>();
	}

	/**
	 * Creating the singleton instance holder class using the Solution of Bill Pugh to avoid concurrency initialization
	 * issues
	 */
	private static class AmountFormatRegistryHolder
	{
		static final AmountFormatRegistry INSTANCE = new AmountFormatRegistry(new AmountFormatIndexer());
	}

	/**
	 * This method returns the instance of the Registry. The registry is configured with indexer used by Canvas
	 * Framework
	 * 
	 * @return The instance of the AmountFormatRegistry
	 */
	public static AmountFormatRegistry getInstance()
	{
		return AmountFormatRegistryHolder.INSTANCE;
	}

	/**
	 * This method register the Amount Formats Configuration
	 * 
	 * @param xmlConfigPath- it is the amount formats configuration file (eg:canvas-amountformat.xml)
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(java.lang.String)
	 */
	public void register(String xmlConfigPath) throws BaseException
	{
		InputStream sourceData = null;
		XMLParser parser = null;
		String negativeSignPosition = null;
		NegativeSignFormat negativeFormat = null;
		try
		{
			sourceData = ResourceLoaderUtils.loadResource(xmlConfigPath);
			// If no exception has been encountered, then the resource was loaded successfully. So try to parse it into
			// an XML

			AmountFormat.AmountFormatBuilder builder = null;
			parser = new XMLParser(sourceData);
			String amountId = "";
			String description = "";
			String charStr = "";
			char groupSeparator;
			char decimalSeparator;
			int groupSize;
			int leadingGroupSize;
			String formatterClass = "";
			String clientFormatterClass = "";
			boolean canOverride = false;
			boolean enabled = true;
			int count = parser.getNodeCount("format");
			for (int i = 0; i < count; i++)
			{
				Node n = parser.getNode("format", i);
				amountId = XMLParser.getAttributeValueAtNode(n, "Id");
				description = XMLParser.getAttributeValueAtNode(n, "description");
				negativeSignPosition = XMLParser.getAttributeValueAtNode(n, "negativeSignPosition");
				negativeSignPosition = StringUtils.ensureExists(negativeSignPosition,
						NegativeSignFormat.PREFIX.toString());
				try
				{
					negativeFormat = NegativeSignFormat.valueOf(negativeSignPosition);
				} catch (IllegalArgumentException e)
				{
					LOGGER.cterror("CTBAS00107", e);
					negativeFormat = NegativeSignFormat.PREFIX;
				}

				charStr = XMLParser.getAttributeValueAtNode(n, "groupSeparator");
				if (charStr == null || charStr == "")
				{
					groupSeparator = PreferenceConstants.DEFAULT_AMOUNT_GROUPSEPARATOR;
				} else
				{
					groupSeparator = charStr.charAt(0);
				}
				charStr = XMLParser.getAttributeValueAtNode(n, "decimalSeparator");
				if (charStr == null || charStr == "")
				{
					decimalSeparator = PreferenceConstants.DEFAULT_AMOUNT_DECIMALSEPARATOR;
				} else
				{
					decimalSeparator = charStr.charAt(0);
				}
				groupSize = StringUtils.convertToInt(XMLParser.getAttributeValueAtNode(n, "groupSize"),
						PreferenceConstants.DEFAULT_AMOUNT_GROUPSIZE);
				// if the leadinggroup is not provided then groupsize is assign to default leadinggroupsize
				leadingGroupSize = StringUtils.convertToInt(XMLParser.getAttributeValueAtNode(n, "leadingGroupSize"),
						groupSize);
				formatterClass = StringUtils.ensureExists(XMLParser.getAttributeValueAtNode(n, "formatter-class"),
						PreferenceConstants.DEFAULT_AMOUNT_FORMATTERCLASS);
				clientFormatterClass = StringUtils.ensureExists(
						XMLParser.getAttributeValueAtNode(n, "client-formatter-class"), "");
				canOverride = StringUtils.convertToBoolean(XMLParser.getAttributeValueAtNode(n, "canOverride"));
				String temp = StringUtils.ensureExists(XMLParser.getAttributeValueAtNode(n, "isEnabled"), "true");
				enabled = StringUtils.convertToBoolean(temp);
				builder = new AmountFormat.AmountFormatBuilder();
				builder.setAmountId(amountId).setDescription(description).setGroupSeparator(groupSeparator)
						.setNegativeSignFormat(negativeFormat).setDecimalSeparator(decimalSeparator)
						.setGroupSize(groupSize).setLeadingGroupSize(leadingGroupSize)
						.setFormatterClass(formatterClass).setClientFormatterClass(clientFormatterClass)
						.setOverridable(canOverride).setEnabled(enabled);
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
		if (aContent instanceof AmountFormat)
		{
			AmountFormat contentToAdd = (AmountFormat) aContent;
			amountFormatCache.add(contentToAdd);
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
		if (aContent instanceof AmountFormat && origContent instanceof AmountFormat)
		{
			AmountFormat contentToAdd = (AmountFormat) aContent;
			// Ideally the position does not matter as this has no bearing in AmountFormat identification. So delete
			// the
			// origContent and add the new content
			amountFormatCache.remove(origContent);
			amountFormatCache.add(contentToAdd);
		}
	}

	/**
	 * This method register UnRegisterImpl
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
		if (aContent instanceof AmountFormat)
		{
			AmountFormat contentToRemove = (AmountFormat) aContent;
			unregSuccess = amountFormatCache.remove(contentToRemove);
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
		return amountFormatCache.iterator();
	}

}
