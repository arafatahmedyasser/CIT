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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.ehcache.Ehcache;
import net.sf.ehcache.config.SearchAttribute;
import net.sf.ehcache.config.Searchable;
import net.sf.ehcache.search.Attribute;
import net.sf.ehcache.search.Direction;
import net.sf.ehcache.search.Query;
import net.sf.ehcache.search.Result;
import net.sf.ehcache.search.Results;
import net.sf.ehcache.search.SearchException;
import net.sf.ehcache.search.expression.Criteria;
import net.sf.ehcache.search.impl.BaseResult;
import net.sf.ehcache.search.impl.GroupedResultImpl;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.cache.ICBXCacheManager;
import com.intellectdesign.canvas.cache.ICBXCacheWrapper;
import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.ehcache.attributeextractor.CBXEhCacheHashMapAttributeExtractor;
import com.intellectdesign.canvas.ehcache.impl.CBXAttributeFactory;
import com.intellectdesign.canvas.ehcache.impl.CBXCriteriaFactory;
import com.intellectdesign.canvas.ehcache.impl.EhCacheManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.PhraseVariable;
import com.intellectdesign.canvas.viewdefinition.ColumnDefinition;
import com.intellectdesign.canvas.viewdefinition.ColumnFilter;
import com.intellectdesign.canvas.viewdefinition.GroupingModel;
import com.intellectdesign.canvas.viewdefinition.SortDefinition;
import com.intellectdesign.canvas.viewdefinition.SummaryDefinition;
import com.intellectdesign.canvas.viewdefinition.cache.calc.CTAggregators;

/**
 * This is special implementation file of cachemanger of the ehcache. It extends the ICBXCacheManager This written
 * specifically for the SimpleViewDefinitionInstruction for caching the data that can be queried in future.
 * 
 * @version 1.0
 */
public class VDFEhCacheManager implements IVDFCacheManager
{

	private static EhCacheManager ehCacheManager;

	private static String key = CacheConstants.VDF_CACHE_REGISTRY;

	/**
	 * Using the Solution of Bill Pugh for singleton pattern instead of double checked locking pattern
	 */
	private static class VDFEhCacheManagerInstanceHolder
	{
		static final VDFEhCacheManager INSTANCE = new VDFEhCacheManager();
	}

	/**
	 * Written a private constructor to avoid initializing the class. The class should be initiated with the method
	 * create.
	 * 
	 * @throws CBXCacheException
	 */
	VDFEhCacheManager()
	{
		ehCacheManager = (EhCacheManager) EhCacheManager.createInstance();
		try
		{
			if (!ehCacheManager.isCacheAvailable(key))
			{
				ehCacheManager.initializeCache(key, new HashMap());
			}
		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T.getCause(), key);
		}

	}

	/**
	 * This method is to instantiate the ehcache manager. Since this is the implementation class and the method has to
	 * be static it is not available in interfaces.
	 * 
	 * @return this singleton class reference
	 * @throws CBXCacheException
	 */

	public static ICBXCacheManager createInstance() throws CBXCacheException
	{
		return VDFEhCacheManagerInstanceHolder.INSTANCE;
	}

	/**
	 * this is ref to PrePareEhcacheSearchable hashmap {@inheritDoc}
	 */
	public Searchable prepareEhcacheSearchable(HashMap<?, ?> config)
	{
		ArrayList columnsMD = (ArrayList) config.get(CacheConstants.VIEW_COLUMN_DEFINITION);

		Searchable searchable = new Searchable();

		SearchAttribute searchAttribute;

		for (int i = 0; i < columnsMD.size(); i++)
		{

			searchAttribute = new SearchAttribute().name(((ColumnDefinition) columnsMD.get(i)).getColumnId())
					.className(CBXEhCacheHashMapAttributeExtractor.class.getName());
			searchable.addSearchAttribute(searchAttribute);
		}
		return searchable;
	}

	/**
	 * this is ref to fetchDataFromCache
	 * 
	 * @param cacheid,paginationModel
	 * @exception CBXCacheException {@inheritDoc}
	 */

	public List<Object> fetchDataFromCache(String cacheId, PaginationModel model) throws CBXCacheException
	{

		Ehcache cache = getcache(cacheId);
		try
		{

			Query query = cache.createQuery();
			Results results = query.execute();

			List response = new ArrayList();

			if (model != null)
			{
				for (Result resultv : results.range(model.getStartRowOfPage()-1, model.getPagesize()))
				{
					response.add(resultv.getValue());
				}
			} else
			{

				for (Result resultv : results.all())
				{
					response.add(resultv.getValue());
				}

			}

			return response;
		} catch (Throwable T)
		{
			LOGGER.cterror("CTVDF00002", T.getCause(), cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_013, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * this method is used to get Ehcache ids
	 * 
	 * @param cacheId string value of CacheId
	 * @throws CBXCacheException {@inheritDoc}
	 */
	private Ehcache getcache(String cacheId) throws CBXCacheException
	{
		return ehCacheManager.getcache(cacheId);
	}

	/**
	 * this is ref to fetchDataFromCache get SortDefintion
	 * 
	 * @param cacheid,paginationModel
	 * @exception CBXCacheException {@inheritDoc}
	 */

	public List<Object> fetchDataFromCache(String cacheId, PaginationModel model, List<Object> sortDefinitions,
			List<Object> filterDefintions) throws CBXCacheException
	{

		Ehcache cache = getcache(cacheId);
		try
		{

			Query query = cache.createQuery();
			query.includeValues();

			query = queryBuilderForSorting(query, cache, sortDefinitions);
			query = queryBuilderForFiltering(query, cache, filterDefintions);

			Results results = query.execute();

			int totalCount = results.size();

			List response = new ArrayList();
			if (model != null)
			{
				for (Result resultv : results.range(model.getStartRowOfPage()-1, model.getPagesize()))
				{
					HashMap record = (HashMap) resultv.getValue();
					record.put(CacheConstants.TOTAL_COUNT, totalCount);
					response.add(record);
				}
			} else
			{

				for (Result resultv : results.all())
				{
					HashMap record = (HashMap) resultv.getValue();
					record.put(CacheConstants.TOTAL_COUNT, totalCount);
					response.add(record);
				}

			}
			return response;
		} catch (Throwable T)
		{
			LOGGER.cterror("CTVDF00002", T.getCause(), cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_014, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * The method builds the query for sorting
	 * 
	 * @param query
	 * @param cache
	 * @param sortDefinitions
	 * @return Query
	 */

	private Query queryBuilderForSorting(Query query, Ehcache cache, List sortDefinitions)
	{

		SortDefinition sortDef = null;

		for (Object sortDefinition : sortDefinitions)
		{
			sortDef = (SortDefinition) sortDefinition;

			Attribute attribute = CBXAttributeFactory.getInstance().createAttribute(cache, sortDef.getActualColumnID(),
					sortDef.getColumnDatatype());
			query.includeAttribute(attribute);
			query.addOrderBy(attribute, getDirectionObject(sortDef.getSortOrder()));
		}

		return query;
	}

	/**
	 * The Method decide whether its ascending or descending
	 * 
	 * @param sortOrder
	 * @return Direction
	 */
	private Direction getDirectionObject(String sortOrder)
	{
		if (CacheConstants.DESC.equals(sortOrder))
		{
			return Direction.DESCENDING;
		} else
		{
			return Direction.ASCENDING;
		}
	}

	/**
	 * The method builds the query for Filtering
	 * 
	 * @param query
	 * @param cache
	 * @param filterDefintions
	 * @return Query
	 */
	private Query queryBuilderForFiltering(Query query, Ehcache cache, List filterDefintions)
	{

		ColumnFilter colFilter = null;

		Criteria criteria = null;

		for (Object filterDefintion : filterDefintions)
		{
			colFilter = (ColumnFilter) filterDefintion;
			Attribute attribute = CBXAttributeFactory.getInstance().createAttribute(cache, colFilter.getColumnID(),
					colFilter.getDataType());
			query.includeAttribute(attribute);

			Criteria tempCriteria = CBXCriteriaFactory.getInstance().createCriteria(colFilter.getFilterID(),
					colFilter.getFilterValues(), attribute);

			if (tempCriteria != null)
			{

				if (criteria != null)
				{
					criteria = criteria.and(tempCriteria);
				} else
				{
					criteria = tempCriteria;
				}
			}

		}
		if (criteria != null)
			query.addCriteria(criteria);

		return query;
	}

	/**
	 * this is ref to fetchDataFromCache
	 * 
	 * @param cache id,PaginationModel
	 * @exception CBXCacheException {@inheritDoc}
	 */

	public List<Object> fetchDataFromCache(String cacheId, PaginationModel model, List<Object> sortDefinitions,
			List<Object> filterDefintions, GroupingModel groupingModel) throws CBXCacheException
	{

		Ehcache cache = getcache(cacheId);
		try
		{

			List finalResponse = new ArrayList();
			List subResult;
			HashMap sub;
			String key = generateKey(groupingModel);
			// If the grouping model is by three columns , the grouping is called iteratively by removing
			// the last grouping column. i.e, Grouping by Col1,Col2,Col3 and then by Col1,Col2 and then by Col3
			// And finally aggragation is for the grand total without any grouping.

			for (;;)
			{
				subResult = ehCacheGroupingManager(filterDefintions, groupingModel, cache);
				sub = new HashMap();

				if (CacheConstants.TOTAL.equals(key))
				{
					subResult = ehCacheGroupingManager(filterDefintions, groupingModel, cache);
					sub.put(key, subResult);
					finalResponse.add(sub);
					break;
				}

				sub.put(key, subResult);
				finalResponse.add(sub);
				if (key.lastIndexOf(CacheConstants.DELIMITER) > 0)
				{
					key = key.substring(0, key.lastIndexOf(CacheConstants.DELIMITER));
				} else
				{
					key = CacheConstants.TOTAL;
				}
				groupingModel.getGroupedColumn().remove(groupingModel.getGroupedColumn().size() - 1);
			}
			return finalResponse;

		} catch (Throwable T)
		{
			LOGGER.cterror("CTVDF00002", T.getCause(), cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_014, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * This is to generate the key for the grouping Model . Since it contains multiple grouping information. For Example
	 * there is three level grouping. Col1, Col2, Col3. Then the key generated are
	 * Col1,Col1&_&Col2,Col1&_&Col2&_&Col3,Total First Key holds the information of grouping only the Col1 Second Key
	 * holds the information of grouping only the Col1, Col2 Third Key holds the information of grouping only the Col1,
	 * Col2, Col3 and so on and finally total of complete records.
	 * 
	 * @param groupingModel
	 * @return String Key
	 */
	private String generateKey(GroupingModel groupingModel)
	{

		List groupingColumn = groupingModel.getGroupedColumn();
		ColumnDefinition columnDefinition = null;
		StringBuilder key = new StringBuilder();

		for (int i = 0; i < groupingColumn.size(); i++)
		{
			columnDefinition = (ColumnDefinition) groupingColumn.get(i);
			key.append(columnDefinition.getColumnId());
			if (i != groupingColumn.size() - 1)
				key.append(CacheConstants.DELIMITER);
		}
		return key.toString();
	}

	/**
	 * This method is responsible for grouping of columns according to the grouping model it recieve
	 * 
	 * @param filterDefintions
	 * @param groupingModel
	 * @param cache
	 * @return List
	 * @throws SearchException
	 */
	private List<Object> ehCacheGroupingManager(List<Object> filterDefintions, GroupingModel groupingModel,
			Ehcache cache)
	{
		Query query = cache.createQuery();
		Results results = null;
		List response = new ArrayList();

		query = queryBuilderForFiltering(query, cache, filterDefintions);

		query = queryBuilderForGrouping(groupingModel, cache, query);

		results = query.execute();

		for (Result resultv : results.all())
		{
			Map record = new HashMap();
			if (resultv instanceof GroupedResultImpl)
			{
				record = ((GroupedResultImpl) resultv).getGroupByValues();
			}

			List aggreResult = ((BaseResult) resultv).getAggregatorResults();
			record.put(CacheConstants.AGGREGATION, formatAggreResult(aggreResult, groupingModel));
			response.add(record);
		}
		return response;
	}

	/**
	 * It Forms the hashmap of grpuping columns with the aggregation data.
	 * 
	 * @param aggreResult
	 * @param groupingModel
	 * @return Map
	 */

	private Map formatAggreResult(List aggreResult, GroupingModel groupingModel)
	{
		HashMap columnMap = new HashMap();
		int index = 0;
		for (Object summaryDef : groupingModel.getSummaryDefinition())
		{
			columnMap.put(((SummaryDefinition) summaryDef).getColumnID(), aggreResult.get(index++));
		}

		return columnMap;
	}

	/**
	 * This method does the actual grouping in ehcache and gets the data.
	 * 
	 * @param groupingModel
	 * @param cache
	 * @param query
	 * @return query
	 */
	private Query queryBuilderForGrouping(GroupingModel groupingModel, Ehcache cache, Query query)
	{

		List groupingColumn = groupingModel.getGroupedColumn();
		ColumnDefinition columnDefinition = null;

		for (int i = 0; i < groupingColumn.size(); i++)
		{

			columnDefinition = (ColumnDefinition) groupingColumn.get(i);

			final Attribute attribute = CBXAttributeFactory.getInstance().createAttribute(cache,
					columnDefinition.getColumnId(), columnDefinition.getDataType());

			query.includeAttribute(attribute);

			query.addOrderBy(attribute, Direction.ASCENDING);
			query.addGroupBy(attribute);

		}

		SummaryDefinition summaryDefinition = null;

		for (Object summaryDef : groupingModel.getSummaryDefinition())
		{
			summaryDefinition = (SummaryDefinition) summaryDef;

			final Attribute attribute = CBXAttributeFactory.getInstance().createAttribute(cache,
					summaryDefinition.getColumnID(), summaryDefinition.getColumnDatatype());

			if (CacheConstants.COUNT.equals(summaryDefinition.getSummarytype()))
			{
				query.includeAggregator(CTAggregators.count());
			} else if (CacheConstants.SUM.equals(summaryDefinition.getSummarytype()))
			{

				query.includeAggregator(CTAggregators.sum(attribute));
			} else if (CacheConstants.AVG.equals(summaryDefinition.getSummarytype()))
			{

				query.includeAggregator(CTAggregators.average(attribute));
			} else if (CacheConstants.MAX.equals(summaryDefinition.getSummarytype()))
			{

				query.includeAggregator(CTAggregators.max(attribute));

			} else if (CacheConstants.MIN.equals(summaryDefinition.getSummarytype()))
			{

				query.includeAggregator(CTAggregators.min(attribute));
			}

		}

		return query;
	}

	private static Logger LOGGER = Logger.getLogger(VDFEhCacheManager.class);

	/**
	 * This method is used to initialize the Cache using CacheID
	 * 
	 * @param cacheId
	 * @throws CBXCacheException
	 * 
	 *             {@inheritDoc}
	 */
	public boolean initializeCache(String cacheId, HashMap<?, ?> config) throws CBXCacheException
	{
		return initializeCacheEx(cacheId, config, prepareEhcacheSearchable(config));
	}

	/**
	 * this is ref to initCacheEx
	 * 
	 * @param cacheId
	 * @param config
	 * @return
	 * @throws CBXCacheException
	 */
	public boolean initializeCacheEx(String cacheId, HashMap<?, ?> config, Searchable searchable)
			throws CBXCacheException
	{
		return ehCacheManager.initializeCacheEx(cacheId, config, searchable);
	}

	/**
	 * this is ref to ICBXCacheWrapper
	 * 
	 * @param cacheId
	 * @return
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#getcacheWrapper(java.lang.String)
	 */
	@Override
	public ICBXCacheWrapper<?, ?> getcacheWrapper(String cacheId) throws CBXCacheException
	{
		return ehCacheManager.getcacheWrapper(cacheId);
	}

	/**
	 * this is ref CacheAvailable
	 * 
	 * @param cacheId
	 * @return
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#isCacheAvailable(java.lang.String)
	 */
	@Override
	public boolean isCacheAvailable(String cacheId) throws CBXCacheException
	{
		return ehCacheManager.isCacheAvailable(cacheId);
	}

	/**
	 * this is ref toremoveCache
	 * 
	 * @param cacheId
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#removeCache(java.lang.String)
	 */
	@Override
	public void removeCache(String cacheId) throws CBXCacheException
	{
		ehCacheManager.removeCache(cacheId);

	}

	/**
	 * this is ref to removeCacheStartingWith
	 * 
	 * @param cacheIdPrefix
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#removeCacheStartingWith(java.lang.String)
	 */
	@Override
	public void removeCacheStartingWith(String cacheIdPrefix) throws CBXCacheException
	{
		ehCacheManager.removeCacheStartingWith(cacheIdPrefix);

	}

	/**
	 * this is ref to fetchdataFromCahe
	 * 
	 * @param cacheId
	 * @return
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#fetchDataFromCache(java.lang.String)
	 */
	@Override
	public List<?> fetchDataFromCache(String cacheId) throws CBXCacheException
	{
		return ehCacheManager.fetchDataFromCache(cacheId);
	}

	/**
	 * this is ref to SetDataIncache
	 * 
	 * @param cacheId
	 * @param data
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#setDataInCache(java.lang.String, java.lang.Object)
	 */
	@Override
	public void setDataInCache(String cacheId, Object data) throws CBXCacheException
	{
		ehCacheManager.setDataInCache(cacheId, data);

	}

	/**
	 * this is ref to fetchDataFromCacheForkey
	 * 
	 * @param cacheId
	 * @param key
	 * @return
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#fetchDataFromCacheForKey(java.lang.String, java.lang.Object)
	 */
	@Override
	public List<?> fetchDataFromCacheForKey(String cacheId, Object key) throws CBXCacheException
	{
		return ehCacheManager.fetchDataFromCacheForKey(cacheId, key);
	}

	/**
	 * this is ref to remove DataFromCacheForkey
	 * 
	 * @param cacheId
	 * @param key
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#removeDataFromCacheForKey(java.lang.String, java.lang.Object)
	 */
	@Override
	public void removeDataFromCacheForKey(String cacheId, Object key) throws CBXCacheException
	{
		ehCacheManager.removeDataFromCacheForKey(cacheId, key);

	}

	/**
	 * this is ref to fetchkeys
	 * 
	 * @param cacheId
	 * @return
	 * @throws CBXCacheException
	 * @see com.intellectdesign.canvas.cache.ICBXCacheManager#fetchKeys(java.lang.String)
	 */
	@Override
	public List<?> fetchKeys(String cacheId) throws CBXCacheException
	{
		return ehCacheManager.fetchKeys(cacheId);
	}

}