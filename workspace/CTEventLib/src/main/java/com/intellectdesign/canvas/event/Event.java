/*************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.

 **************************************************************************/

package com.intellectdesign.canvas.event;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.instruction.EventMasterInstruction;
import com.intellectdesign.canvas.exceptions.common.ApplicationInitializationException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class behaves like an enum for various events. Maps exactly to the Event table.
 * 
 * @version 1.0
 */
public final class Event implements Serializable
{
	/**
	 * Default Serial version UID
	 */
	private static final long serialVersionUID = 3523105953196338354L;

	/**
	 * This hashmap is organized as - Keys == product. Value = HashMap (Key = sub product, Value = Hashmap( key =
	 * function, value = HashMap( Key = action, value to event object) ) )
	 */
	private static HashMap allEventsMap = new HashMap();

	/**
	 * This hashmap is used to maintain an index using Event Id as the key and the entire event as the value.
	 */
	private static HashMap eventIdIndexMap = new HashMap();
	private long lEventId = -1;
	private String sEventName;
	private String sEventDescription;
	private String sProduct;
	private String sSubProduct;
	private String sFunctionCode;
	private String sAction;
	private String sEventType;
	private String sPageCode;
	private String sHostCode;

	/***
	 * Constructor for Event class.
	 * 
	 * @param lId -Event id
	 * @param sName -Event name
	 * @param sDesc -Event Description
	 * @param sProductId -Event product id
	 * @param sSubProductId -Event subproduct Id
	 * @param sFunction -Function code
	 * @param sAction - Action
	 * @param sEventType -Event Type
	 * @param sPageCode -page code
	 * @param sHostCode -host code
	 */

	private Event(final long lId, final String sName, final String sDesc, final String sProductId,
			final String sSubProductId, final String sFunction, final String sAction, final String sEventType,
			final String sPageCode, final String sHostCode)
	{
		this.lEventId = lId;
		this.sEventName = sName;
		this.sEventDescription = sDesc;
		this.sProduct = sProductId;
		this.sSubProduct = sSubProductId;
		this.sFunctionCode = sFunction;
		this.sAction = sAction;
		this.sEventType = sEventType;
		this.sPageCode = sPageCode;
		this.sHostCode = sHostCode;
		Event.addToMap(this);
	}

	/**
	 * Reverse lookup method for identifying an event based on the product, subproduct, function, action
	 * 
	 * @param aProduct The product
	 * @param aSubProduct The sub product
	 * @param aFunction The function
	 * @param aAction The action
	 * @return The event corresponding to the inputs provided.
	 */
	public static Event getEventFor(final String aProduct, final String aSubProduct, final String aFunction,
			final String aAction)
	{
		Event retVal = null;
		HashMap temp;
		initializeEvents();
		temp = (HashMap) allEventsMap.get(aProduct);
		if (temp != null)
		{
			temp = (HashMap) temp.get(aSubProduct);
			if (temp != null)
			{
				temp = (HashMap) temp.get(aFunction);
				if (temp != null)
				{
					retVal = (Event) temp.get(aAction);
				}
			}
		}
		return retVal;
	}

	/**
	 * Reverse lookup method for identifying an event based on the Id provided.
	 * 
	 * @param eventId The Event Id being looked up for
	 * @return The event corresponding to the inputs provided.
	 */
	public static Event getEventFor(final Long eventId)
	{
		Event retVal = null;
		initializeEvents();
		if (eventIdIndexMap.containsKey(eventId))
		{
			retVal = (Event) eventIdIndexMap.get(eventId);
		}
		return retVal;
	}

	/**
	 * This Method is used to populating the Event list values from DB.
	 * 
	 * @throws ApplicationInitializationException
	 * 
	 */
	@SuppressWarnings("unused")
	private static void addHashMapObject() throws ApplicationInitializationException
	{
		EventMasterInstruction eventIns = new EventMasterInstruction();
		ArrayList<HashMap<String, String>> listOfEvents = null;
		Iterator<HashMap<String, String>> it = null;
		HashMap<String, String> mapEvent = null;
		Long eventId;
		List<String> canvasProducts = StringUtils.convertToList(CTProperties.getProperty("CANVAS_PRODUCTS_LIST"), ",");
		String productCode;
		try
		{
			listOfEvents = eventIns.getAllEventList(); // Getting event list from DB
			it = listOfEvents.iterator();
			while (it.hasNext())
			{
				mapEvent = it.next();
				eventId = Long.parseLong(mapEvent.get("EVENT_ID"));
				productCode = mapEvent.get("PRODUCT_CODE");
				if (!canvasProducts.contains(productCode))
				{
					if (eventId < 0)
					{
						logger.cterror("CTEVT00040", mapEvent);
						continue;
					}
				}

				// Creating Event object from DB values And calling the private Event Constructor.
				new Event(Integer.parseInt(mapEvent.get("EVENT_ID")), mapEvent.get("EVENT_TITLE"),
						mapEvent.get("EVENT_DESC"), mapEvent.get("PRODUCT_CODE"), mapEvent.get("SUB_PRODUCT_CODE"),
						mapEvent.get("FUNCTION_CODE"), mapEvent.get("ACTION"), mapEvent.get("EVENT_TYPE_ID"),
						mapEvent.get("PAGE_CODE"), mapEvent.get("HOST_CODE"));
			}
		} catch (DatabaseException dbe)
		{
			logger.cterror("CTEVT00001", dbe);
			throw new ApplicationInitializationException(dbe.getErrorCode(), dbe.getErrorMessage());
		}
	}

	/**
	 * This method adds the current event to the HashMap for reverse lookup purposes.
	 * 
	 * @param anEvent The event to be added to hashmap.
	 */
	private static void addToMap(final Event anEvent)
	{
		HashMap productsMap;
		HashMap subProdMap;
		HashMap funcMap;
		productsMap = getChildMapFrom(allEventsMap, anEvent.getProduct());
		subProdMap = getChildMapFrom(productsMap, anEvent.getSubProduct());
		funcMap = getChildMapFrom(subProdMap, anEvent.getFunctionCode());
		funcMap.put(anEvent.getAction(), anEvent);
		// Maintain one more map for lookup using Event ids.
		eventIdIndexMap.put(anEvent.getEventId(), anEvent);
	}

	/**
	 * Helper method to get a child hashmap from the parent map for the key. If the map is not present then it creates
	 * the entry in the parent and returns the map.
	 * 
	 * @param parentMap The map from which child has to be extracted
	 * @param key The key to be used for extraction
	 * @return The map pointing to the key provided.
	 */
	private static HashMap getChildMapFrom(final HashMap parentMap, final String key)
	{
		HashMap childMap = null;
		if (parentMap.containsKey(key))
		{
			childMap = (HashMap) parentMap.get(key);
		} else
		{
			childMap = new HashMap();
			parentMap.put(key, childMap);
		}
		return childMap;
	}

	/**
	 * Returns Event Id.
	 * 
	 * @return lEventId as Long
	 */
	public long getEventId()
	{
		return lEventId;
	}

	/**
	 * Returns Action.
	 * 
	 * @return the sAction as String
	 */
	public String getAction()
	{
		return sAction;
	}

	/**
	 * Returns Event Description.
	 * 
	 * @return sEventDescription as String
	 */
	public String getEventDescription()
	{
		return sEventDescription;
	}

	/**
	 * Returns Event Name.
	 * 
	 * @return sEventName as String
	 */
	public String getEventName()
	{
		return sEventName;
	}

	/**
	 * Returns Event Type.
	 * 
	 * @return sEventType as String
	 */
	public String getEventType()
	{
		return sEventType;
	}

	/**
	 * Returns Function Code.
	 * 
	 * @return sFunctionCode as String
	 */
	public String getFunctionCode()
	{
		return sFunctionCode;
	}

	/**
	 * Returns Product.
	 * 
	 * @return sProduct as String
	 */
	public String getProduct()
	{
		return sProduct;
	}

	/**
	 * Returns Sub-product.
	 * 
	 * @return sSubProduct as String
	 */
	public String getSubProduct()
	{
		return sSubProduct;
	}

	/**
	 * Returns Sub-product.
	 * 
	 * @return sSubProduct as String
	 */
	public String getPageCode()
	{
		return sPageCode;
	}

	/**
	 * Returns Sub-product.
	 * 
	 * @return sSubProduct as String
	 */

	public String getHostCode()
	{
		return sHostCode;
	}

	/**
	 * Returns Event Name,Product,Sub product,Action performed.
	 * 
	 * @return String of Event Name,Product,Sub product,Action performed
	 */
	public String toString()
	{
		if (lEventId == -1)
		{
			return "Event constant not initialized.";
		}
		return "[Event Name: " + sEventName + ", Product: " + sProduct + ", Sub product: " + sSubProduct
				+ ", Action performed: " + sAction + "Page Code :" + sPageCode + "Host Code:" + sHostCode + "]";
	}

	/**
	 * This method loads the eventlist data only once when the application launched.
	 */

	private static void initializeEvents()
	{
		try
		{
			if (eventIdIndexMap.isEmpty())
				addHashMapObject();
		} catch (ApplicationInitializationException e)
		{
			logger.cterror("CTEVT00001", e);
		}
	}

	private static final Logger logger = Logger.getLogger(Event.class);
}