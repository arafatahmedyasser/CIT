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
import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * IAmountFormatter is an interface for Amount formatting subclasses which 
 * formats amount values as per target AmountFormat manner. 
 *  
 * @version 1.0
 */
public interface IAmountFormatter
{
	/**
	 * This method hepls to format value for the AmountFormat provided.
	 * 
	 * @param decimalValue The numberValue
	 * @param fractionDigits The number decimals
	 * @param formatConfig The AmountFormat
	 * @throws BaseException
	 */
	String formatAmount(BigDecimal decimalValue, int fractionDigits,AmountFormat formatConfig) throws BaseException;

}
