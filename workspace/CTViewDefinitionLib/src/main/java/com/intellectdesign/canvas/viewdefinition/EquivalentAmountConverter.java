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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.ratecard.IRateCard;
import com.intellectdesign.canvas.ratecard.IRateCardFactory;

/**
 * This class is for converting equalent amount
 * 
 * @version 1.0
 */
public class EquivalentAmountConverter
{

	/**
	 * This method helps to update the list with an equivalent amount
	 * 
	 * @param listViewData - The list having the column required for conversion like amount, currency etc.,
	 * @param viewDefinition
	 * @param mapInputParams - The map having the details about the user.
	 * @throws ViewDefinitionException
	 */
	public void checkForEquivalentAmount(List listViewData, ViewDefinition viewDefinition, Map mapInputParams)
			throws ViewDefinitionException
	{

		PerformanceTimer equiCurrencyPT = new PerformanceTimer();
		equiCurrencyPT.startTimer("EquivalentAmountConverter.checkForEquivalentAmount");
		try
		{
			/**
			 * step 1 : Get the list column from the viewDefinition and check the eqamt datatype column is available in
			 * the listview.
			 */
			List colList = viewDefinition.getListColumns();
			ColumnDefinition colDef = null;
			for (Object colObject : colList)
			{
				colDef = (ColumnDefinition) colObject;

				if (ViewDefinitionConstants.DATA_TYPE_RATE.equals(colDef.getDataType()))
				{
					LOGGER.ctdebug("CTVDF00363", colDef.getColumnId());
					String colId = colDef.getColumnId();

				}

				if (ViewDefinitionConstants.DATA_TYPE_NUMBER_EQ_AMT.equals(colDef.getDataType()))
				{

					String rateCardId = null;
					/**
					 * step 2 : check the value is currency value is coming from inputparams or check in viewdefinition
					 * preferences or check in the user preference or get the currency value from default bank currency.
					 */
					String prefCurrency = (String) mapInputParams.get(ViewDefinitionConstants.CURRENCY_CD);
					if (prefCurrency == null || " ".equals(prefCurrency))
					{
						ViewDefinitionPreferences viewPref = viewDefinition.getViewPreferences();

						if (viewPref != null)
						{
							prefCurrency = viewPref.getReferenceCcy();
							rateCardId = viewPref.getRateCardId();
						}
						if (prefCurrency == null || " ".equals(prefCurrency))
						{
							prefCurrency = (String) mapInputParams.get(ViewDefinitionConstants.EQUICURR);
						}
						if (prefCurrency == null || " ".equals(prefCurrency))
						{
							List bankProfileList = CacheManager.getInstance().getDataFromCache(null,
									ViewDefinitionConstants.CACHE_KEY_DEFAULT_BANK_PROFILE);
							for (Object object : bankProfileList)
							{
								Map bankProfileMap = (HashMap) object;
								prefCurrency = (String) bankProfileMap
										.get(ViewDefinitionConstants.FLD_OD_BANK_REF_CURR);
							}
						}
					}

					String userNo = mapInputParams.get(ViewDefinitionConstants.INPUT_USER_NO).toString();
					String gcifNumber = mapInputParams.get(ViewDefinitionConstants.INPUT_GCIF).toString();
					/**
					 * Step 3: Get ratecard value from the user preference check the ratecard, the value is not null
					 * then call the performAmountconversion method.
					 */
					if (rateCardId == null)
					{
						rateCardId = (String) mapInputParams.get(ViewDefinitionConstants.RATECARD);

					}
					if (rateCardId != null)
					{

						/**
						 * step 4 : Get the amount format precision from the cache and check with currency to get
						 * precision value.
						 */

						/**
						 * List allCurrencyPrecision = CacheManager.getInstance().getDataFromCache(null,
						 * ViewDefinitionConstants.CACHE_KEY_AMOUNT_FORMAT_PRECISION);
						 */
						GlobalCurrencyDataProvider globalCurrencyDataProvider = new GlobalCurrencyDataProvider();
						List allCurrencyPrecision = globalCurrencyDataProvider.getCurrencyBasedDecimalData();

						boolean isCurrencySet = false;
						int precision = 2; // default value
						Iterator it = allCurrencyPrecision.iterator();
						Map currencyMap = null;
						String tmpCurrency = null;
						while (it.hasNext() && !isCurrencySet)
						{
							currencyMap = (Map) it.next();
							tmpCurrency = (String) currencyMap.get(ViewDefinitionConstants.FIELD_COD_CCY);
							if (prefCurrency != null)
							{
								if (prefCurrency.equals(tmpCurrency))
								{
									String precisionStr = (String) currencyMap
											.get(ViewDefinitionConstants.FIELD_NBR_DECIMAL);
									precision = Integer.parseInt(precisionStr);
									isCurrencySet = true;
								}
							}
						}
						/**
						 * step 5 : call performAmountConversion method to perform the equivalent amount conversion and
						 * update the listview.
						 */
						performAmountConversion(listViewData, viewDefinition, precision);

					}
				}
			}

		} catch (Exception e)
		{

		}
		equiCurrencyPT.endTimer();

	}

	/**
	 * This method is to perform amount conversion based on the ratecard settings.
	 * 
	 * @param listViewData - The list having the column required for conversion like amount, currency etc.,
	 * @param aCard - the ratecard settings for the conversion.
	 * @return List - updated list value after the equivalent amount conversion
	 */
	private List performAmountConversion(List listViewData, ViewDefinition viewDefinition, int precisionValue)
	{

		BigDecimal childAmount = null;
		BigDecimal retVal = null;
		BigDecimal conversionRate = null;
		String ccy = "";
		HashMap recMap = null;
		Iterator listIterator = listViewData.iterator();
		String srcAmtFldName = null;
		String srcCurrencyFldName = null;
		List colList = viewDefinition.getListColumns();
		Map conversionMap = new HashMap();
		ColumnDefinition colDef = null;
		String columnId = null;
		/**
		 * step 1 : Get the linked amount column, linked ccy column from the column definition.
		 */
		for (Object object : colList)
		{
			colDef = (ColumnDefinition) object;
			columnId = colDef.getColumnId();
			srcAmtFldName = null;
			if (ViewDefinitionConstants.DATA_TYPE_NUMBER_EQ_AMT.equals(colDef.getDataType()))
			{
				srcAmtFldName = colDef.getLinkedSourceAmt();
				conversionMap.put(srcAmtFldName, columnId);
			}
		}

		Set entrySet = conversionMap.entrySet();
		String toColName = null;
		while (listIterator.hasNext())
		{
			recMap = (HashMap) listIterator.next();

			for (Object object : entrySet)
			{
				Map.Entry mapEntry = (Map.Entry) object;
				srcAmtFldName = (String) mapEntry.getKey();
				toColName = (String) mapEntry.getValue();
				colDef = viewDefinition.getColumnDefnForColumn(srcAmtFldName);
				srcCurrencyFldName = colDef.getLinkedSourceCcy();
				ConfigurationManager configMgr = ConfigurationManager.getInstance();
				IRateCard rateCard = null;

				if (recMap.get(srcAmtFldName) instanceof String)
				{
					childAmount = new BigDecimal(((String) (recMap.get(srcAmtFldName))).replace(",", "")).setScale(precisionValue,
							RoundingMode.HALF_UP);
				} else if (recMap.get(srcAmtFldName) instanceof Integer)
				{
					childAmount = new BigDecimal((Integer) (recMap.get(srcAmtFldName))).setScale(precisionValue,
							RoundingMode.HALF_UP);
				} else if (recMap.get(srcAmtFldName) instanceof BigDecimal)
				{
					childAmount = ((BigDecimal) (recMap.get(srcAmtFldName))).setScale(precisionValue,
							RoundingMode.HALF_UP);
				} else if (recMap.get(srcAmtFldName) instanceof Float)
				{
					childAmount = new BigDecimal((Float) (recMap.get(srcAmtFldName))).setScale(precisionValue,
							RoundingMode.HALF_UP);
				} else
				{
					childAmount = new BigDecimal(String.valueOf((recMap.get(srcAmtFldName)))).setScale(precisionValue,
							RoundingMode.HALF_UP);
				}

				ccy = (String) recMap.get(srcCurrencyFldName);
				/**
				 * step 3 : convert the amount column to Equivalent Amount based on the ratecard.
				 */

				if (childAmount != null && !BigDecimal.ZERO.equals(childAmount))
				{

					try
					{
						String rateFactoryClassName = configMgr.getImplClassDescriptor().getRateCardFactoryClass();
						IRateCardFactory rateCardFactory = (IRateCardFactory) Class.forName(rateFactoryClassName)
								.newInstance();
						rateCard = rateCardFactory.getDefaultRateCard();
					} catch (ClassNotFoundException classNotFoundException)
					{

					} catch (InstantiationException instantiationException)
					{

					} catch (IllegalAccessException illegalAccessException)
					{

					}

					conversionRate = new BigDecimal(rateCard.getConversionRateFor(ccy, rateCard.getBaseCurrency()));
					/**
					 * step 4 :If a valid conversion rate was found, then convert the same. Else make the value as null.
					 */
					if (!BigDecimal.ZERO.equals(conversionRate))
					{
						retVal = childAmount.multiply(conversionRate);
						/**
						 * step 5 : update the list value with converted currency and ratecard
						 */
						recMap.put(toColName, retVal);
					}
				}

			}

		}
		return listViewData;
	}

	/**
	 * Instance of Logger for this class.
	 */
	private static final Logger LOGGER = Logger.getLogger(EquivalentAmountConverter.class);

}
