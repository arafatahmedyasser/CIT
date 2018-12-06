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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.currency.GlobalCurrencyConstants;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.ratecard.IRateCard;
import com.intellectdesign.canvas.ratecard.IRateCardFactory;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;

/**
 * AmountFormatterManager is helper class provides many class methods for amount format . No instances of this class is
 * ever expected to be created.
 * 
 * @Version 1.0
 */
public final class AmountFormatterManager
{

	private static final Logger logger = Logger.getLogger(AmountFormatterManager.class);

	/**
	 * Marking the constructor private to avoid instance creation.
	 */
	private AmountFormatterManager()
	{

	}

	/**
	 * This is utility method to get AmountFormatconfig objecet for the Amount format.
	 * 
	 * @param toformat
	 * @return AmountFormat Object
	 */
	public static AmountFormat getAmountFormat(String toformat)
	{
		String mName = "getAmountFormat()";
		AmountFormat amountFormat = null;
		// look up in AmountFormatRegistry with toformat(amountId) and it returns AmountFormat Object
		AmountFormatRegistry amtFrmtRegistry = AmountFormatRegistry.getInstance();
		try
		{
			amountFormat = (AmountFormat) amtFrmtRegistry.lookup(toformat);
		} catch (Exception e)
		{
			logger.cterror("CTBAS00110", e, mName);
		}
		return amountFormat;
	}

	/**
	 * Hepls this utility method convert AmountFormat object into JSON String.
	 * 
	 * @param sAmountFormat-The AmountFormat Config Object
	 * @return Json String- The AmountFormatJson String
	 */
	public static String getAmountFormatJson(String sAmountFormat)
	{
		String sAmountFormatJson = null;
		AmountFormat amountFormat = null;
		HashMap amtHashMap = new HashMap();
		amountFormat = getAmountFormat(sAmountFormat);
		amtHashMap.put("amountId", amountFormat.getAmountId());
		amtHashMap.put("groupSize", amountFormat.getGroupSize());
		amtHashMap.put("leadingGroupSize", amountFormat.getLeadingGroupSize());
		// Assign "S" symbol as space separator for client side support
		if (amountFormat.getGroupSeparator() == ' ')
		{
			amtHashMap.put("groupSeparator", "S");
		} else
		{
			amtHashMap.put("groupSeparator", amountFormat.getGroupSeparator());
		}
		// Assign "S" symbol as space separator for client side support
		if (amountFormat.getDecimalSeparator() == ' ')
		{
			amtHashMap.put("decimalSeparator", "S");
		} else
		{
			amtHashMap.put("decimalSeparator", amountFormat.getDecimalSeparator());
		}
		amtHashMap.put("clientFormatterClass", amountFormat.getClientFormatterClass());
		amtHashMap.put("negativeSignFormat", amountFormat.getNegativeSignFormat());
		sAmountFormatJson = HashMapToJSONConverter.convertHashMapToJSONFormat(amtHashMap);
		return sAmountFormatJson;
	}

	/**
	 * Helps this utility method to format amount values as per target amount format.
	 * 
	 * @param decimalValue
	 * @param fractionDigits
	 * @param formatConfig
	 * @return formatted amount
	 */
	public static String getFormattedAmount(BigDecimal decimalValue, int fractionDigits, AmountFormat formatConfig)

	{
		String mName = "getFormattedAmount()";
		String formattedAmount = null;
		IAmountFormatter amountFormatter = null;
		try
		{
			amountFormatter = (IAmountFormatter) ResourceLoaderUtils.createInstance(formatConfig.getFormatterClass(),
					(Object[]) null);
			formattedAmount = amountFormatter.formatAmount(decimalValue, fractionDigits, formatConfig);
		} catch (Exception e)
		{
			logger.cterror("CTBAS00111", e, mName);
		}
		return formattedAmount;
	}

	/**
	 * api to convert amount data using a format and precision values based on the currency passed as paramater. - if
	 * the currency passed from the paramater is null/empty, gets the default bank currency from the cache. - If the
	 * default bank currency is also not avaialble, gets the default currency from the orbionedirect.properties. - Using
	 * the currency, it takes the fractional values form the GlobalCurrencyCache, which will be used to format.
	 * 
	 * @param value
	 * @param toformat
	 * @param currency
	 * @return Returns the amount
	 */
	public static String convertAmountTo(String value, String toformat, String currency)
	{
		String mName = "convertAmountTo";
		logger.ctinfo("CTBAS00048", mName);
		BigDecimal decimalValue = null;
		AmountFormat formatConfig = null;
		String returnVal = null;
		CacheManager cacheManager = CacheManager.getFWInstance();
		try
		{
			String linkedCurrency = currency;
			if (linkedCurrency == null || linkedCurrency.equals(""))
			{
				ConfigurationManager configMgr = ConfigurationManager.getInstance();
				logger.ctdebug("CTBAS00050");
				// get the default bank currency from the cache.
				List<Map> bankProfileList = cacheManager.getDataFromCache(null, "DEFAULT_BANK_PROFILE");
				for (Object object : bankProfileList)
				{
					Map bankProfileMap = (HashMap) object;
					linkedCurrency = (String) bankProfileMap.get("OD_BANK_REF_CURR");

				}
				if (linkedCurrency == null || linkedCurrency.equals(""))
				{
					IRateCard rateCard = null;
					String rateFactoryClassName = configMgr.getImplClassDescriptor().getRateCardFactoryClass();
					IRateCardFactory rateCardFactory = (IRateCardFactory) Class.forName(rateFactoryClassName)
							.newInstance();
					rateCard = rateCardFactory.getDefaultRateCard();
					linkedCurrency = rateCard.getCardCurrency();

					logger.ctdebug("CTBAS00051");
					// get the default currency configured in the orbionedirect.propertyfile.
					if (linkedCurrency == null || linkedCurrency.equals(""))
					{
						linkedCurrency = configMgr.getSystemPrefDescriptor().getDefaultCurrency();
					}
				}
				logger.ctdebug("CTBAS00052", linkedCurrency);

			}
			int fractionDigits = 2;
			HashMap<String, String> currDecimalMap = null;
			List<HashMap<String, String>> currencyDataList = cacheManager.getDataFromCache(null,
					GlobalCurrencyConstants.GLOBAL_CURR_CACHE);

			if (currencyDataList != null && currencyDataList.size() != 0)
			{
				currDecimalMap = currencyDataList.get(0);
				logger.ctdebug("CTBAS00076", mName, currDecimalMap);
				fractionDigits = Integer.valueOf(currDecimalMap.get(linkedCurrency));
				logger.ctdebug("CTBAS00077", mName, linkedCurrency, fractionDigits);
			}

			if (value != null && !value.trim().equals(""))
			{
				decimalValue = new BigDecimal(value);
				// get AmountFormat Configuration Object from AmountFormatterManager
				formatConfig = getAmountFormat(toformat);
				// get the formatted amount value from AmountFormatterManager
				returnVal = getFormattedAmount(decimalValue, fractionDigits, formatConfig);
			} else
			{
				returnVal = value;
			}
		} catch (Exception e)
		{
			logger.cterror("CTBAS00053", e, mName);
		}
		return returnVal;
	}

	/**
	 * converts the incoming amountstring to a standard format. which without the group separator Note: the incoming
	 * format decimal separator should always be '.' and the group separator should always be ','
	 * 
	 * @param value
	 * @param incomingFormat
	 * @return amount converted to standard format, i.e nnnnn.nnn
	 */
	public static String convertAmountToStandardFormat(String value, String incomingFormat)
	{
		BigDecimal decimalValue = null;
		AmountFormat formatConfig = null;
		String returnValue = null;
		
		// BigDecimal Support Done using ICU4J classes
		if (value != null && !value.trim().equals(""))
		{
			decimalValue = new BigDecimal(value);
			// get AmountFormat Configuration Object from AmountFormatterManager
			formatConfig = getAmountFormat(incomingFormat);
			// get the formatted amount value from the AmountFormatterManager.
			returnValue = getFormattedAmount(decimalValue, 2, formatConfig);

		} else
		{
			// Returns the incoming value for null and empty String
			returnValue = value;
		}
		return returnValue;
	}

	/**
	 * This method is used to convert given amount value to given format. And set the given no of fraction digit if it
	 * is between 0 to 5. Else return the amount field without the fraction digits. Any exception occured while
	 * formating or null or empty String, returns input value.
	 * 
	 * @param value - Value to be convert.
	 * @param toformat - To format.
	 * @param noOfFractionDigit - no of fraction digit to set in amount.
	 * @return Returns given value after formating to given format and setting given no of fraction digit.
	 */
	public static String convertAmountTo(String value, String toformat, int noOfFractionDigit)
	{
		return convertAmountTo(value, toformat, noOfFractionDigit, noOfFractionDigit);
	}

	/**
	 * This method is used to convert given amount value to given format. And set the given no of fraction digit if it
	 * is between 0 to 5. Else return the amount field without the fraction digits. Any exception occured while
	 * formating or null or empty String, returns input value.
	 * 
	 * @param value Value to be convert.
	 * @param toformat To format.
	 * @param minFractionDigits no of min fraction digit to set in amount.
	 * @param maxFractionDigits no of max fraction digit to set in amount.
	 * @return Returns given value after formating to given format and setting given no of fraction digit.
	 */
	public static String convertAmountTo(String value, String toformat, int minFractionDigits, int maxFractionDigit)
	{
		String cmName = "convertAmountTo(String val,string val1,int val2,int val2)";
		BigDecimal decimalValue = null;
		AmountFormat formatConfig = null;
		String returnVal = value;
		if (value != null && !value.trim().equals(""))
		{
			decimalValue = new BigDecimal(value);
			// get AmountFormat Configuration Object from AmountFormatterManager
			formatConfig = getAmountFormat(toformat);
			// get the formatted amount value from the AmountFormatterManager.
			returnVal = getFormattedAmount(decimalValue, maxFractionDigit, formatConfig);
		} else
		{
			returnVal = value;
			// Returns the incoming value for null and empty String
			logger.ctinfo("CTBAS00109", cmName);
		}
		return returnVal;
	}

	/**
	 * This method is used to convert given amount value to given format. And set the given no of fraction digit if it
	 * is between 0 to 5. Else return the amount field without the fraction digits. Any exception occured while
	 * formating or null or empty String, returns input value.
	 * 
	 * @param decimalValue - Value to be convert.
	 * @param toformat - To format.
	 * @param minFractionDigits - no of min fraction digit to set in amount.
	 * @param maxFractionDigits - no of max fraction digit to set in amount.
	 * @return Returns given value after formating to given format and setting given no of fraction digit.
	 */
	public static String convertAmountTo(BigDecimal decimalValue, String toformat, int minFractionDigits,
			int maxFractionDigit)
	{
		String cmName = "convertAmountTo(BigDecimal val,String val1,int val2)";
		String returnVal = "";
		AmountFormat formatConfig = null;
		if (decimalValue != null)
		{
			// get AmountFormat Configuration Object from AmountFormatterManager
			formatConfig = getAmountFormat(toformat);
			// get the formatted amount value from the AmountFormatterManager.
			returnVal = getFormattedAmount(decimalValue, minFractionDigits , formatConfig);
			// ParseException occured while parsing Amount
			returnVal = decimalValue.toString();
		} else
			// Returns the incoming value for null
			logger.ctinfo("CTBAS00109", cmName);
		return returnVal;
	}

}
