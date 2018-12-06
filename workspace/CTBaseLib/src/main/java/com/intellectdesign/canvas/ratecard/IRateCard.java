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
package com.intellectdesign.canvas.ratecard;

import java.util.HashMap;
import java.util.List;

/**
 * This interface represents the behavior expected of a Rate card. The rate card could be a bank rate card or a customer
 * defined one
 * 
 * @version 1.0
 */
public interface IRateCard
{
	/**
	 * ref to IRateCard currency constructor
	 */
	public static final String FLD_RATE = "RATE";
	public static final String FLD_QUOTE_CURR = "QUOTE_CURR";
	public static final String FLD_BASE_CURR = "BASE_CURR";
	public static final String FLD_EXRATECARD = "EXRATECARD";
	public static final String FLD_RATE_CARD_DESC = "RATE_CARD_DESC";
	public static final String FLD_DEFALUTCCY = "DEFALUTCCY";

	/**
	 * This method returns the rate for the source to the target currency. The rate is to be evaluated as 1 unit of
	 * source currency = <rate> units of target currency.
	 * 
	 * @param sourceCurrency The source currency
	 * @param targetCurrency The target currency
	 * @return The conversion rate. In case conversion is not possible, the value 0.0 should be returned.
	 */
	double getConversionRateFor(String sourceCurrency, String targetCurrency);

	/**
	 * Get the Rate Card ID for this rate card
	 * 
	 * @return The ID of the rate card
	 */
	String getRateCardId();

	/**
	 * Get the Rate Card description for this rate card
	 * 
	 * @return The rate card description
	 */
	String getRateCardDescription();

	/**
	 * Get the Rate Card Currency for this rate card
	 * 
	 * @return the Card Currency
	 */
	String getCardCurrency();

	/**
	 * Get the List of all currencies supported by this rate card
	 * 
	 * @return The list of supported currencies in this rate card.
	 */
	List<String> getAllCurrencies();

	/**
	 * This method returns true if the rate card has got initialized with any conversion rate information. Else it
	 * returns false returns false
	 * 
	 * @return true if the Rate card is initialized. False otherwise.
	 */
	boolean isInitialized();

	/**
	 * This method gets the list of conversion rates from base ccy to target ccy as a List of Maps
	 * 
	 * @return List of maps having the conversion rates between the card ccy to the various CCY present.
	 */
	List<HashMap> getAllConversionRates();

	/**
	 * This method returns whether the rate card is a bank rate card.
	 * 
	 * @return true if the rate card is a bank rate card. False if it is a customer rate card.
	 */
	boolean isBankRateCard();

	/**
	 * This method returns the baseCurrency
	 * 
	 * @return the basecurrency
	 */
	String getBaseCurrency();
}
