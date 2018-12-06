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
package com.intellectdesign.canvas.cache.handler;

import javax.servlet.http.HttpSession;

/**
 * This class is responsible to get the data for the cache key provided
 * 
 * @version 1.0
 */
public class CacheReloadThread implements Runnable
{
	private String cacheId;
	private HttpSession session;

	/**
	 * Constructor of the class with CacheId and HttpSession as params
	 * 
	 * @param id
	 * @param sess
	 */
	public CacheReloadThread(String id, HttpSession sess)
	{
		this.cacheId = id;
		this.session = sess;
	}

	/**
	 * (non-Javadoc) ref to CacheReloadThread
	 * 
	 * @see java.lang.Runnable#run()
	 */
	public void run()
	{
		// Trigger the cache data fetch.
		CacheManager.getInstance().getDataFromCache(session, cacheId);
	}

}
