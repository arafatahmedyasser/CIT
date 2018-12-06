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

package com.intellectdesign.canvas.viewdefinition.cache.calc;

import java.math.BigDecimal;

import net.sf.ehcache.search.Attribute;
import net.sf.ehcache.search.aggregator.AggregatorException;
import net.sf.ehcache.search.aggregator.AggregatorInstance;

/**
 * Compute the average (arithmetic mean) as a double
 * 
 * @version 1.0
 */
public class CTAverage implements AggregatorInstance<Double>
{

	private final Attribute<?> attribute;

	private Engine engine;

	/**
	 * this is ref CTAVG values
	 * 
	 * @param attribute
	 */
	public CTAverage(Attribute<?> attribute)
	{
		this.attribute = attribute;
	}

	/**
	 * this is ref CTAVG return vales attribute
	 * 
	 * @return CTAvg {@inheritDoc}
	 */
	public CTAverage createClone()
	{
		return new CTAverage(attribute);
	}

	/**
	 * this is ref to Acceppt Obj
	 * 
	 * @throws AggregatorException
	 * @return {@inheritDoc}
	 *         <p/>
	 *         Null values are ignored and not included in the computation
	 */
	public void accept(Object input) throws AggregatorException
	{
		if (input == null)
		{
			return;
		}

		if (input instanceof Number)
		{
			if (engine == null)
			{
				engine = Engine.create((Number) input);
			} else
			{
				engine.accept((Number) input);
			}
		} else
		{
			throw new AggregatorException("Non-number type encounted: " + input.getClass());
		}
	}

	/**
	 * this is ref Num Aggregation {@inheritDoc}
	 * 
	 * @return <p/>
	 *         null is returned if there was no input supplied to this function
	 */
	public Number aggregateResult()
	{
		if (engine == null)
		{
			return null;
		} else
		{
			return engine.result();
		}
	}

	/**
	 * this is ref GetAttribute
	 * 
	 * @return attribute {@inheritDoc}
	 */
	public Attribute getAttribute()
	{
		return attribute;
	}

	/**
	 * Abstract super-class for all average calculating engines.
	 */
	abstract static class Engine
	{

		/**
		 * Create a type specific engine using the given initial value.
		 * 
		 * @param value initial value
		 * @return type specific engine
		 */
		static Engine create(Number value)
		{
			if (value instanceof Float)
			{
				return new FloatEngine(value.floatValue());
			} else if (value instanceof Double)
			{
				return new DoubleEngine(value.doubleValue());
			} else if (value instanceof Long)
			{
				return new LongEngine(value.longValue());
			} else if (value instanceof BigDecimal)
			{
				return new BigDecimalEngine(new BigDecimal(value.toString()));
			} else
			{
				return new IntegerEngine(value.intValue());
			}
		}

		/**
		 * Update the engine with the given value.
		 * 
		 * @param input data value
		 */
		abstract void accept(Number input) throws AggregatorException;

		/**
		 * Get the (current) result of this engine.
		 * 
		 * @return engine result
		 */
		abstract Number result();

		/**
		 * An int based averaging engine.
		 */
		static class IntegerEngine extends Engine
		{

			private int count;
			private long sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			IntegerEngine(int value)
			{
				this.count = 1;
				this.sum = value;
			}

			/**
			 * this is ref accept num
			 * 
			 * @param input
			 * @throws AggregatorException
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTAverage.Engine#accept(java.lang.Number)
			 */
			@Override
			void accept(Number input) throws AggregatorException
			{
				count++;
				sum += input.intValue();
			}

			@Override
			Number result()
			{
				return Float.valueOf(((float) sum) / count);
			}
		}

		/**
		 * A long based averaging engine.
		 */
		static class LongEngine extends Engine
		{

			private int count;
			private long sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			LongEngine(long value)
			{
				this.count = 1;
				this.sum = value;
			}

			@Override
			void accept(Number input) throws AggregatorException
			{
				count++;
				sum += input.longValue();
			}

			@Override
			Number result()
			{
				return Double.valueOf(((double) sum) / count);
			}
		}

		/**
		 * A float based averaging engine.
		 */
		static class FloatEngine extends Engine
		{

			private int count;
			private float sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			FloatEngine(float value)
			{
				this.count = 1;
				this.sum = value;
			}

			/**
			 * this is ref Accept Number Aggregation
			 * 
			 * @param input
			 * @throws AggregatorException
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTAverage.Engine#accept(java.lang.Number)
			 */
			@Override
			void accept(Number input) throws AggregatorException
			{
				count++;
				sum += input.floatValue();
			}

			@Override
			Number result()
			{
				return Float.valueOf(sum / count);
			}
		}

		/**
		 * A double based averaging engine.
		 */
		static class DoubleEngine extends Engine
		{

			private int count;
			private double sum;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			DoubleEngine(double value)
			{
				this.count = 1;
				this.sum = value;
			}

			/**
			 * this is ref to Num Input Aggregation
			 * 
			 * @param input
			 * @throws AggregatorException
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTAverage.Engine#accept(java.lang.Number)
			 */
			@Override
			void accept(Number input) throws AggregatorException
			{
				count++;
				sum += input.doubleValue();
			}

			@Override
			Number result()
			{
				return Double.valueOf(sum / count);
			}
		}

		/**
		 * A bigdecimal based summing engine.
		 */
		static class BigDecimalEngine extends Engine
		{

			private BigDecimal sum;
			private BigDecimal avg;
			private int count;
			private BigDecimal cnt;

			/**
			 * Creates a new instance starting with an initial value
			 * 
			 * @param value initial value
			 */
			BigDecimalEngine(BigDecimal value)
			{
				this.count = 1;
				this.sum = value;
			}

			/**
			 * ref to BigDecimal Number
			 * 
			 * @param input
			 * @throws AggregatorException
			 * @see com.intellectdesign.canvas.viewdefinition.cache.calc.CTAverage.Engine#accept(java.lang.Number)
			 */
			void accept(Number input) throws AggregatorException
			{
				count++;
				sum = sum.add(new BigDecimal(input.toString()));
			}

			Number result()
			{
				cnt = new BigDecimal(count);
				avg = sum.divide(cnt);
				return avg;
			}
		}

	}
}
