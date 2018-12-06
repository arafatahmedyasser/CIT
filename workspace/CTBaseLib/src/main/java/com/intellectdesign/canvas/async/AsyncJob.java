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

import java.io.Serializable;

/**
 * This is the base class for a job that needs to be executed. The Job by itself as well as the data that it gets should
 * be serializable as there could be a potential serialization of the data before the job actually gets executed.
 * 
 * @Version 15.1
 */
public abstract class AsyncJob implements Serializable
{
	/**
	 * Internal constant for serialization purposes.
	 */
	private static final long serialVersionUID = -4860185734307576839L;

	private AsyncContext context = null;

	/**
	 * The only constructor for this class. Takes the context under which this job should be executed
	 * 
	 * @param theContext The context associated with this job.
	 * @exception IllegalArgumentException Thrown if the AsyncContext provided is null.
	 */
	public AsyncJob(AsyncContext theContext)
	{
		context = theContext;
		if (theContext == null)
			throw new IllegalArgumentException("AsyncContext provided to the job cannot be null");
	}

	/**
	 * Returns the context associated with this job.
	 * 
	 * @return The context associated with this job.
	 */
	public AsyncContext getAsyncContext()
	{
		return context;
	}

	/**
	 * This is the entry point for the job. This will be invoked by the Executor Setup whenever this job is picked up
	 * for processing
	 * 
	 * @exception AsyncExecutorException Thrown if any error occurs while executing the job
	 */
	public final void execute() throws AsyncExecutorException
	{
		// Step 1: Update the thread local with the data from the context.
		getAsyncContext().updateCurrentThreadLocalData();
		try
		{
			executeJob();
		} finally
		{
			getAsyncContext().resetCurrentThreadLocalData();
		}
	}

	/**
	 * This method has to be implemented by the sub classes for the actual job execution.
	 * 
	 * @exception AsyncExecutorException Thrown if any error occurs while executing the job
	 */
	public abstract void executeJob() throws AsyncExecutorException;
}
