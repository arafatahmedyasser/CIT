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
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * CanvasAmountFormatter is default class for formatting amount values in a target AmountFormat manner.
 * 
 * 
 * @Version 1.0
 */
public class CanvasAmountFormatter implements IAmountFormatter
{
	private static final char  DIGIT_ZERO_ABSENT = '#';
	private static final char  MINUS_SIGN = '-';
	private static final char  DIGIT= '0';
	private static final char  GROUP_SEPARATOR= ',';
	private static final char  DECIMAL_SEPARATOR = '.';
	private static final char  WRAP_PREFIX= '(';
	private static final char  WRAP_SUFFIX = ')';
	private static final BigDecimal THOUSAND = new BigDecimal(1000);

	/**
	 * 
	 * This method is used to format given value as per the Amount Format.
	 * 
	 * @param numberValue
	 * @param numDecimals
	 * @param formatConfig
	 * @throws BaseException
	 * @return formatted value
	 * @see com.intellectdesign.canvas.pref.amount.IAmountFormatter#formatAmount(java.math.BigDecimal, int, com.intellectdesign.canvas.pref.amount.AmountFormat)
	 */
	@Override
	public String formatAmount(BigDecimal numberValue, int numDecimals, AmountFormat formatConfig) throws BaseException
	{
			int groupSize = formatConfig.getGroupSize();
			int leadingGroupSize = formatConfig.getLeadingGroupSize();
			DecimalFormatSymbols symbols = convertToSymbols(formatConfig, numDecimals);
			StringBuilder result = new StringBuilder();
			DecimalFormat df;
			BigDecimal workingVal = numberValue.abs();
			char digitChar = DIGIT_ZERO_ABSENT;
			NegativeSignFormat negFormat = formatConfig.getNegativeSignFormat();
			boolean isNegative = (numberValue.signum() == -1);
			if (groupSize != leadingGroupSize)
			{
				// Construct 2 patterns. First that will format the leading amount part. second that will format the
				// thousand and the remaining decimals.
				// Only if the number is >= 1000, then we need to worry about the leading group size
				if (workingVal.compareTo(THOUSAND) > 0)
				{
					// Split by 1000 and use the leading group separator for the integer part.
					BigDecimal[] parts = workingVal.divideAndRemainder(THOUSAND);
					// Use 0 for the number of decimals as the trailing part
					df = new DecimalFormat(constructPattern(leadingGroupSize, 0, digitChar), symbols);
					result.append(df.format(parts[0])).append(formatConfig.getGroupSeparator());
					// Adjust the working value to the remainder. So that the flow for the standard group size works
					// smoothly.
					workingVal = parts[1].abs(); // If the value is negative, then negative sign is included in the first
													// part
					digitChar = DIGIT;
				}
			}
			df = new DecimalFormat(constructPattern(groupSize, numDecimals, digitChar), symbols);
			result.append(df.format(workingVal));
			if (isNegative)
			{
				switch (negFormat)
				{
				case PREFIX:
					result.insert(0, MINUS_SIGN);
					break;
				case SUFFIX:
					result.append(MINUS_SIGN);
					break;
				case WRAP:
					result.insert(0, WRAP_PREFIX).append(WRAP_SUFFIX);
					break;
				default:
					// Nothing to do here
				}
			}

		return result.toString();
	}

	/**
	 * Constructs the DecimalFormatSymbols from the Amount format configuration.
	 * 
	 * @param formatConfig The amount format configuration
	 * @param numDecimals The number of decimals
	 * @return The DecimalFormatSymbols for the given configuration
	 */
	private DecimalFormatSymbols convertToSymbols(AmountFormat formatConfig, int numDecimals)
	{
		DecimalFormatSymbols symbols = new DecimalFormatSymbols();
		symbols.setGroupingSeparator(formatConfig.getGroupSeparator());
		symbols.setDecimalSeparator(formatConfig.getDecimalSeparator());
		return symbols;
	}

	/**
	 * Helper method to construct the pattern that needs to be passed to the Decimal format based on the group size and
	 * the number of decimals.
	 * 
	 * @param groupSize The group size
	 * @param numDecimals The number of decimals
	 * @param digitChar The charater to be used as the placeholder
	 * @return The format for DecimalFormat to be used for the given combination
	 */
	private String constructPattern(int groupSize, int numDecimals, char digitChar)
	{
		StringBuilder sb = new StringBuilder();
		sb.append(String.valueOf(DIGIT_ZERO_ABSENT)+String.valueOf(GROUP_SEPARATOR))
		.append(StringUtils.pad(String.valueOf(DIGIT), groupSize, digitChar, true));
		if (numDecimals > 0)
			sb.append(StringUtils.pad(String.valueOf(DECIMAL_SEPARATOR), numDecimals + 1, DIGIT, false));
		return sb.toString();
	}

}
