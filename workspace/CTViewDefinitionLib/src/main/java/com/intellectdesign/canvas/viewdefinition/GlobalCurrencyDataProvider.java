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

package com.intellectdesign.canvas.viewdefinition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.currency.GlobalCurrencyConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.currency.ICurrencyDataProvider;

/**
 * This class is for global currency data provider implements icurrency provider
 * 
 * @version 1.0
 */
public class GlobalCurrencyDataProvider implements ICurrencyDataProvider
{

	/**
	 * Fetches currency decimal data from the database table.
	 * 
	 * @param Str Decimal Data
	 * @return List of HashMap currency decimal places data.
	 */
	public List<HashMap<String, String>> getCurrencyBasedDecimalData()
	{
		String fnName = "[GlobalCurrencyCacheBuilder.getCurrencyBasedDecimalData]";
		logger.ctinfo("CTVDF00364", fnName);
		List<HashMap<String, String>> currlistData = new ArrayList<HashMap<String, String>>();
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		dbRequest.setDataAccessMapKey(GlobalCurrencyConstants.GLOBAL_CCY_ACCESS_MAP_KEY);
		dbRequest.setOperation(DatabaseConstants.SELECT);
		dbRequest.setOperationExtension(GlobalCurrencyConstants.GLOBAL_CCY_EXT);

		HashMap<String, String> currItemMap = null;
		HashMap<String, String> currdataMap = null;
		try
		{
			DatabaseResult dbResult = dbRequest.execute();
			// currlistData = dbResult.getReturnedList();

			if (dbResult.getReturnedList().size() > 0)
			{
				currdataMap = new HashMap<String, String>();
				for (int i = 0; i < dbResult.getReturnedList().size(); i++)
				{
					currItemMap = (HashMap<String, String>) dbResult.getReturnedList().get(i);
					String currency = currItemMap.get("CURRENCY");
					String decimalPlace = currItemMap.get("NBR_DECIMAL");

					currdataMap.put(currency, decimalPlace);
				}
				currlistData.add(currdataMap);
			} else
			{
				logger.cterror("CTVDF00793");
			}
		} catch (DatabaseException e)
		{
			logger.cterror("CTVDF00365", e);
		}

		return currlistData;
	}

	private Logger logger = Logger.getLogger(GlobalCurrencyDataProvider.class);
}
