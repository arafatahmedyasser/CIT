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

package com.intellectdesign.canvas.viewdefinition.cache;

import java.util.List;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.cache.ICBXCacheManager;
import com.intellectdesign.canvas.database.PaginationModel;

/**
 * This interface encapsulates the methods related to fetching data from the cache
 * 
 * @version 1.0
 */
public interface IVDFCacheManager extends ICBXCacheManager
{

	/**
	 * This method is to fetch data from the cache with corresponding paging , sorting and filtering
	 * 
	 * @param String CacheId
	 * @return List listData
	 * @throws CBXCacheException
	 */

	public List<Object> fetchDataFromCache(String cacheId, PaginationModel model) throws CBXCacheException;

	/**
	 * This method is to fetch data from the cache with corresponding paging , sorting and filtering
	 * 
	 * @param String CacheId
	 * @return List listData
	 * @throws CBXCacheException
	 */

	public List<Object> fetchDataFromCache(String cacheId, PaginationModel model, List<Object> sortDefinitions,
			List<Object> filterDefintions) throws CBXCacheException;

}
