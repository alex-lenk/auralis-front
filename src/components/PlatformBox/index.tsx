'use client'

import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import deviceStore from '@/stores/deviceStore'
import { getOsName, getArchitecture, getGpuAcceleration, checkPermissions } from '@/lib/device'

const PlatformBox = observer(() => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadDeviceData = async () => {
        const permissions = await checkPermissions()
        deviceStore.setDeviceData({
          osName: getOsName(),
          arch: getArchitecture(),
          cores: navigator.hardwareConcurrency || null,
          gpuAcceleration: getGpuAcceleration(),
          colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Тёмная' : 'Светлая',
          userAgent: navigator.userAgent,
          datetime: new Date().toLocaleString(),
          permissions,
        })
      }

      loadDeviceData()
    }
  }, [])

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Платформа</h2>
        <ul className="space-y-2">
          <li><b>Название:</b> {deviceStore.osName}</li>
          <li><b>Архитектура:</b> {deviceStore.arch}</li>
          <li><b>Количество логических ядер процессора:</b> {deviceStore.cores ?? 'Неизвестно'}</li>
          <li><b>Аппаратное ускорение:</b> {deviceStore.gpuAcceleration}</li>
          <li><b>Системная цветовая схема:</b> {deviceStore.colorScheme}</li>
          <li><b>User agent:</b> {deviceStore.userAgent}</li>
          <li><b>Дата и время:</b> {deviceStore.datetime}</li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Разрешения</h2>
        <ul className="space-y-2">
          {Object.entries(deviceStore.permissions).map(([key, value]) => (
            <li key={key}>
              <b>{key}:</b> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

export default PlatformBox
