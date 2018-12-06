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

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * This interface should be implemented by applications to define the factory of Rate cards that are supported by the
 * application. Multiple instances of this factory can be created by Canvas. So it is expected that the factory by
 * itself is lightweight and acts as a use and throw object.
 * 
 * The Ratecards itself may get accessed multiple times within the application. Care should be taken to ensure that Rate
 * card processing is kept light weight and does not involve heavy processing as it will have an adverse impact on the
 * performance.
 * 
 * @version 1.0
 */

public interface IRateCardFactory
{
	/**
	 * This method should return the list of all rate cards that are supported by the application.
	 * 
	 * @param userNo The id of the user
	 * @param gcif The GCIF to which the user belongs to
	 * @return The list of rate cards. This is not expected to be null or empty.
	 * @throws BaseException Thrown if any error occurs while getting the list of rate cards
	 */
	IRateCard[] getAllRateCards(String userNo, String gcif) throws BaseException;

	/**
	 * This method should return the rate card for the particular rate card id provided. The user and gcif are also
	 * provided to handle scenarios where the application may be supporting user / customer specific rate cards
	 * 
	 * @param rateCardId The Rate card Id
	 * @param userNo The id of the user
	 * @param gcif The GCIF to which the user belongs to
	 * @param targetCurrency The target currency to which conversion is expected to be done
	 * @return The Rate card to be used
	 * @throws BaseException Thrown if any error occurs while getting the particular Rate card
	 */
	IRateCard getRateCard(String rateCardId, String userNo, String gcif, String targetCurrency) throws BaseException;

	/**
	 * This method is invoked by Canvas to get the default rate card that should be used if the user has not chosen any
	 * specific preference.
	 * 
	 * @return The default rate card to be used within the system
	 */
	IRateCard getDefaultRateCard();
}
