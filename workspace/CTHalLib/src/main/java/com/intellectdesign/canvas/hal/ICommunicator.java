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

package com.intellectdesign.canvas.hal;

import java.util.HashMap;

/**
 * Interface that has to be implemented by all Communicator Classes.
 * 
 * @version 1.0
 */
public interface ICommunicator
{

	// HAResponse process(HARequest hareq, HashMap appidConfHM);
	/**
	 * Sends to Async Job Processor
	 * 
	 * @param hareq
	 * @param appidConfHM
	 * @return HAResponse
	 */
	public HAResponse sendToAsync(HARequest hareq, HashMap appidConfHM);

	/**
	 * Sends to Product Processor Host.
	 * 
	 * @param hareq
	 * @param appidConfHM
	 * @return HAResponse
	 */
	public HAResponse sendToHost(HARequest hareq, HashMap appidConfHM);

	/**
	 * Sends to Orbi Integrator.
	 * 
	 * @param hareq
	 * @param appidConfHM
	 * @return HAResponse
	 */
	public HAResponse sendToOI(HARequest hareq, HashMap appidConfHM);

    /**
     * Sends information to Service Request Processor.
     * @param hareq
     * @param appidConfHM
     * @return HAResponse
     */
	public HAResponse sendToSR(HARequest hareq, HashMap appidConfHM);
    /**
     * Sends information to Service Request Communicator to fetch details from DB
     * @param hareq
     * @param appidConfHM
     * @return HAResponse
     */
	public HAResponse sendToDB(HARequest hareq, HashMap appidConfHM);
}
