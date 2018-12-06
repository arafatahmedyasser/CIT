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
package com.intellectdesign.canvas.async;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is the version of the Async Executor that uses java.concurrent's ThreadPoolExecutor as the basis for executing
 * an asynchronous task. This uses a ThreadPool constructed using the following configured options -
 * <ul>
 * <li><b>minPoolSize</b>: This configures the minimum number of threads that should be present in the pool. If not
 * provided, this is taken as 3 by default.</li>
 * <li><b>maxPoolSize</b>: This is the maximum number of threads that should be allocated to this pool. If this is less
 * than the minPoolSize, then this is automatically reset to the minPoolSize. If not provided, then this is defaulted to
 * the minPoolSize.</li>
 * <li><b>keepAliveTimeInms</b>: This is the keep alive time for the inactive threads in the pool. If not provided, this
 * is considered to be 2000 ms by default.</li>
 * <li><b>queueDepthThreshold</b>: This provides the monitoring of the queue depth for identifying any tuning that needs
 * to be done on the pool size and keep alive based on the queue build up. If not configured, then this monitoring is
 * turned off.</li>
 * </ul>
 * 
 * The ThreadPoolExecutor is created using a LinkedBlockingQueue which results in no cases where any task added will be
 * rejected. To optimize the pool size parameters, whenver a new task is added, the size of the pending items in the
 * queue is logged in debug mode. If the queueDepthThreshold has been configured, then if the queue depth breaches the
 * threshold, same is logged in error mode for identification of this scenario for performance tuning.
 * 
 * @Version 15.1
 */
public class TPEAsyncExecutorSetup extends AsyncExecutorSetup
{
	private TPEConfiguration config;
	public static final String MIN_THREAD_POOL_SIZE = "minPoolSize";
	public static final String MAX_THREAD_POOL_SIZE = "maxPoolSize";
	public static final String KEEP_ALIVE_TIME_MS = "keepAliveTimeInms";
	public static final String QUEUE_DEPTH_THRESHOLD = "queueDepthThreshold";

	protected static final Logger LOGGER = Logger.getLogger(TPEAsyncExecutorSetup.class);

	/**
	 * @param setupName
	 */
	public TPEAsyncExecutorSetup(String setupName)
	{
		super(setupName);
		config = new TPEConfiguration();
	}

	/**
	 * This accepts the configuration parameters that have been provided to this ThreadPooLExecutor setup. In case there
	 * is an attribute that is not recognized, this ignores the same and logs it for debugging purposes.
	 * 
	 * @param attribName The attribute name
	 * @param attribValue The attribute value
	 * @throws AsyncExecutorException Kept from override perspective. But not thrown from this class.
	 * @see com.intellectdesign.canvas.async.AsyncExecutorSetup#setAttribute(java.lang.String, java.lang.String)
	 */
	@Override
	public void setAttribute(String attribName, String attribValue) throws AsyncExecutorException
	{
		if (MIN_THREAD_POOL_SIZE.equals(attribName))
			config.setMinPoolSize(Integer.valueOf(StringUtils.ensureExists(attribValue, "-1")));
		else if (MAX_THREAD_POOL_SIZE.equals(attribName))
			config.setMaxPoolSize(Integer.valueOf(StringUtils.ensureExists(attribValue, "-1")));
		else if (KEEP_ALIVE_TIME_MS.equals(attribName))
			config.setKeepAliveTimeInms(Integer.valueOf(StringUtils.ensureExists(attribValue, "-1")));
		else if (QUEUE_DEPTH_THRESHOLD.equals(attribName))
			config.setQueueDepthThreshold(Integer.valueOf(StringUtils.ensureExists(attribValue, "-1")));
		else if (!IMPLEMENTATION_CLASS.equals(attribName))
			LOGGER.cterror("CTBAS00091", attribName, attribValue);
	}

	/**
	 * This method is triggered to initialize the setup based on the configuration. Since there are proper defaults for
	 * every configuration, there is typically never a scenario where an exception is thrown
	 * 
	 * @throws AsyncExecutorException Never thrown from this method.
	 * @see com.intellectdesign.canvas.async.AsyncExecutorSetup#initialize()
	 */
	@Override
	public void initialize() throws AsyncExecutorException
	{
		// Step 1: Ensure that the configuration is set right
		config.validateConfiguration();

		// Step 2: Create the thread pool.
		config.initializeThreadPool();

		LOGGER.ctdebug("CTBAS00094", getName());
	}

	/**
	 * Adds a job to the queue
	 * 
	 * @param aJob The job to be added to the queue
	 * @throws AsyncExecutorException Thrown if any error occurs while adding the job to the queue.
	 * @see com.intellectdesign.canvas.async.AsyncExecutorSetup#addJob(com.intellectdesign.canvas.async.AsyncJob)
	 */
	@Override
	public void addJob(AsyncJob aJob) throws AsyncExecutorException
	{
		config.addTask(getName(), aJob);
	}

	/**
	 * This method will be invoked to shutdown this executor. No exceptions can be thrown here as irrespective of the
	 * exception faced, the system will look to move ahead.
	 */
	@Override
	public void shutdown()
	{
		// We shut down the thread pool
		config.shutdown();
	}

	/**
	 * This class is used as the holder for the ThreadPoolExecutor configuration provided to the setup with factory
	 * methods for creation of the pool, validation of the parameters, etc.
	 * 
	 * @Version 15.1
	 */
	protected static class TPEConfiguration
	{
		protected static final int DEFAULT_MIN_POOL_SIZE = 3;
		protected static final int DEFAULT_KEEP_ALIVE_TIME = 2000;
		protected static final int MISSING_CONFIGURATION = -1;
		private int minPoolSize;
		private int maxPoolSize;
		private int queueDepthThreshold;
		private int keepAliveTimeInms;
		private ThreadPoolExecutor mExecutor;

		/**
		 * Here we check the configuration provided and set the defaults as appropriate
		 */
		protected void validateConfiguration()
		{
			if (MISSING_CONFIGURATION == getMinPoolSize())
				setMinPoolSize(DEFAULT_MIN_POOL_SIZE);
			if (MISSING_CONFIGURATION == getMaxPoolSize() || getMaxPoolSize() < getMinPoolSize())
				setMaxPoolSize(getMinPoolSize());
			if (MISSING_CONFIGURATION == getKeepAliveTimeInms())
				setKeepAliveTimeInms(DEFAULT_KEEP_ALIVE_TIME);
		}

		/**
		 * This creates the thread pool based on the configuration provided
		 */
		protected void initializeThreadPool()
		{
			mExecutor = new ThreadPoolExecutor(getMinPoolSize(), getMaxPoolSize(), getKeepAliveTimeInms(),
					TimeUnit.MILLISECONDS, new LinkedBlockingQueue());
		}

		/**
		 * This adds the provided job to the execution queue.
		 * 
		 * @param setupName The name of the setup.
		 * @param aJob THe job to be queued.
		 */
		protected void addTask(String setupName, AsyncJob aJob)
		{
			mExecutor.execute(new ThreadPoolTaskWrapper(aJob));
			LOGGER.ctdebug("CTBAS00096", setupName, mExecutor.getTaskCount(), mExecutor.getCompletedTaskCount(),
					mExecutor.getQueue().size(), mExecutor.getPoolSize(), mExecutor.getActiveCount());
		}

		/**
		 * This method shuts down the threadpool.
		 */
		protected void shutdown()
		{
			if (mExecutor != null)
				mExecutor.shutdownNow();
		}

		/**
		 * @return the minPoolSize
		 */
		protected int getMinPoolSize()
		{
			return minPoolSize;
		}

		/**
		 * @param minPoolSize the minPoolSize to set
		 */
		protected void setMinPoolSize(int minPoolSize)
		{
			this.minPoolSize = minPoolSize;
		}

		/**
		 * @return the maxPoolSize
		 */
		protected int getMaxPoolSize()
		{
			return maxPoolSize;
		}

		/**
		 * @param maxPoolSize the maxPoolSize to set
		 */
		protected void setMaxPoolSize(int maxPoolSize)
		{
			this.maxPoolSize = maxPoolSize;
		}

		/**
		 * @return the queueDepthThreshold
		 */
		protected int getQueueDepthThreshold()
		{
			return queueDepthThreshold;
		}

		/**
		 * @param queueDepthThreshold the queueDepthThreshold to set
		 */
		protected void setQueueDepthThreshold(int queueDepthThreshold)
		{
			this.queueDepthThreshold = queueDepthThreshold;
		}

		/**
		 * @return the keepAliveTimeInms
		 */
		protected int getKeepAliveTimeInms()
		{
			return keepAliveTimeInms;
		}

		/**
		 * @param keepAliveTimeInms the keepAliveTimeInms to set
		 */
		protected void setKeepAliveTimeInms(int keepAliveTimeInms)
		{
			this.keepAliveTimeInms = keepAliveTimeInms;
		}
	}

	/**
	 * This is a task that is actually added to the thread pool. This does the exception handling with logging
	 * 
	 * @Version 15.1
	 */
	public static class ThreadPoolTaskWrapper implements Runnable
	{
		private AsyncJob underlyingJob;

		public ThreadPoolTaskWrapper(AsyncJob aJob)
		{
			underlyingJob = aJob;
		}

		/**
		 * Here we trigger the actual job execution.
		 * 
		 * @see java.lang.Runnable#run()
		 */
		@Override
		public void run()
		{
			try
			{
				underlyingJob.execute();
			} catch (AsyncExecutorException e)
			{
				// Exception cannot be thrown here. So we log the same.
				LOGGER.cterror("CTBAS00095", e);
			}
		}

	}
}
