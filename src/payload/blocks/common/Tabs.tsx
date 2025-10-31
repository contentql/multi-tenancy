'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { JSONTree } from 'react-json-tree'

const tabVariant = {
  active: {
    width: '45%',
    transition: {
      type: 'tween',
      duration: 0.4,
    },
  },
  inactive: {
    width: 'auto', // Keep a fixed width for inactive tabs
    transition: {
      type: 'tween',
      duration: 0.4,
    },
  },
}

const tabTextVariant = {
  active: {
    opacity: 1,
    x: 0,
    display: 'block',
    transition: {
      type: 'tween',
      duration: 0.3,
      delay: 0.3,
    },
  },
  inactive: {
    opacity: 0,
    x: -30,
    height: '10px',
    transition: {
      type: 'tween',
      duration: 0.3,
      delay: 0.1,
    },
    transitionEnd: { display: 'none' },
  },
}

const TabComponent = ({
  tabs,
  defaultIndex = 0,
}: {
  tabs: any
  defaultIndex?: number
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--active-color',
      tabs[activeTabIndex].color,
    )
  }, [activeTabIndex, tabs])

  useEffect(() => {
    const tabFromHash = tabs.findIndex(
      (tab: any) => `#${tab.id}` === window.location.hash,
    )
    setActiveTabIndex(tabFromHash !== -1 ? tabFromHash : defaultIndex)
  }, [tabs, defaultIndex])

  const onTabClick = (index: number) => {
    setActiveTabIndex(index)
  }

  return (
    <div className='container mx-auto overflow-hidden px-10'>
      <div className='tabs-component mx-auto max-w-2xl py-10'>
        <ul
          className='tab-links mb-5 flex list-none justify-center space-x-4 p-0'
          role='tablist'>
          {tabs.map((tab: any, index: number) => (
            <motion.li
              key={tab.id}
              className={`tab relative ${
                activeTabIndex === index ? 'active' : ''
              }`}
              role='presentation'
              variants={tabVariant}
              animate={activeTabIndex === index ? 'active' : 'inactive'}>
              <a
                href={`#${tab.id}`}
                onClick={() => onTabClick(index)}
                className={`flex items-center overflow-hidden whitespace-nowrap px-6 py-3 text-2xl font-semibold no-underline transition-all duration-500 ${
                  activeTabIndex === index
                    ? 'bg-primary text-white'
                    : 'text-primary'
                } rounded-[40px]`}>
                {tab.icon}
                <motion.span className='ml-2' variants={tabTextVariant}>
                  {tab.title}
                </motion.span>
              </a>
            </motion.li>
          ))}
        </ul>
        {tabs.map((tab: any, index: number) => (
          <tab.content
            key={tab.id}
            id={`${tab.id}-content`}
            active={activeTabIndex === index}
            data={tab?.data}
          />
        ))}
      </div>
    </div>
  )
}

const tabContentVariant = {
  active: {
    display: 'block',
    transition: {
      staggerChildren: 0.2,
    },
  },
  inactive: {
    display: 'none',
  },
}

export const TabContent = ({
  id,
  active,
  data,
}: {
  id: any
  active: any
  data: any
}) => {
  return (
    <motion.div
      role='tabpanel'
      id={id}
      className='bg-base-200 mx-auto mt-10 h-screen w-full overflow-y-scroll rounded-2xl p-4 md:h-[500px] lg:max-w-4xl'
      variants={tabContentVariant}
      animate={active ? 'active' : 'inactive'}
      initial='inactive'>
      <JSONTree data={data} invertTheme={false} />
    </motion.div>
  )
}

export default TabComponent
