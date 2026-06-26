"use client"
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, CalendarRange, CalendarDays, Calendar1 } from 'lucide-react'

export function AdminDatePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');
  
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'range'|'month'|'year'>('range');
  
  // Grid viewing state
  const [viewDate, setViewDate] = useState(new Date());
  
  // Range selection state
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const todayDate = new Date();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  useEffect(() => {
    if (isOpen) {
      if (filter === 'range' && startParam) {
        setTab('range');
        setViewDate(new Date(startParam));
        setRangeStart(new Date(startParam));
        if (endParam) setRangeEnd(new Date(endParam));
      } else if (filter === 'month' && monthParam) {
        setTab('month');
        const [y, m] = monthParam.split('-');
        setViewDate(new Date(Number(y), Number(m)-1, 1));
      } else if (filter === 'year' && yearParam) {
        setTab('year');
        setViewDate(new Date(Number(yearParam), 0, 1));
      } else {
        setTab('range');
        setViewDate(new Date());
      }
    }
  }, [isOpen, filter, startParam, endParam, monthParam, yearParam]);

  const generateCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); 
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); 
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  }

  const calendarDays = generateCalendar();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate years for year grid
  const currentDecadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => currentDecadeStart - 1 + i);

  const handlePrev = () => {
    if (tab === 'range') setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    if (tab === 'month') setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    if (tab === 'year') setViewDate(new Date(viewDate.getFullYear() - 10, viewDate.getMonth(), 1));
  };

  const handleNext = () => {
    if (tab === 'range') setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    if (tab === 'month') setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
    if (tab === 'year') setViewDate(new Date(viewDate.getFullYear() + 10, viewDate.getMonth(), 1));
  };

  const isToday = (date: Date) => {
    return date.getFullYear() === todayDate.getFullYear() && 
           date.getMonth() === todayDate.getMonth() && 
           date.getDate() === todayDate.getDate();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  };

  const getDayState = (date: Date) => {
    let isStart = false;
    let isEnd = false;
    let inRange = false;
    
    if (rangeStart && isSameDay(date, rangeStart)) isStart = true;
    if (rangeEnd && isSameDay(date, rangeEnd)) isEnd = true;
    if (rangeStart && rangeEnd && date > rangeStart && date < rangeEnd) inRange = true;
    
    // If only one day is selected, it's both start and end
    if (rangeStart && !rangeEnd && isStart) isEnd = true;
    
    return { isStart, isEnd, inRange };
  };

  const handleDateClick = (day: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
    } else {
      if (day < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(day);
      } else {
        setRangeEnd(day);
      }
    }
  };

  const applyRangeFilter = () => {
    if (!rangeStart) return;
    const end = rangeEnd || rangeStart;
    
    const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    router.push(`/admin?filter=range&start=${formatDate(rangeStart)}&end=${formatDate(end)}`);
    setIsOpen(false);
  };

  const handleMonthClick = (idx: number) => {
    const yyyy = viewDate.getFullYear();
    const mm = String(idx + 1).padStart(2, '0');
    router.push(`/admin?filter=month&month=${yyyy}-${mm}`);
    setIsOpen(false);
  };

  const handleYearClick = (yearValue: number) => {
    router.push(`/admin?filter=year&year=${yearValue}`);
    setIsOpen(false);
  };

  const handleTodayBtn = () => {
    router.push('/admin?filter=today');
    setIsOpen(false);
  };

  const handleThisMonthBtn = () => {
    const yyyy = todayDate.getFullYear();
    const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
    router.push(`/admin?filter=month&month=${yyyy}-${mm}`);
    setIsOpen(false);
  };

  const handleThisYearBtn = () => {
    router.push(`/admin?filter=year&year=${todayDate.getFullYear()}`);
    setIsOpen(false);
  };

  const getDisplayLabel = () => {
    if (!filter || filter === 'all') return 'All Time';
    if (filter === 'today') return 'Today';
    if (filter === 'weekly') return 'Weekly';
    if (filter === 'monthly') return 'Monthly';
    if (filter === 'month' && monthParam) {
      const [y, m] = monthParam.split('-');
      const date = new Date(Number(y), Number(m) - 1, 1);
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    }
    if (filter === 'year' && yearParam) {
      return yearParam;
    }
    if (filter === 'range' && startParam) {
      const start = new Date(startParam);
      if (endParam && startParam !== endParam) {
        const end = new Date(endParam);
        return `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()} - ${end.toLocaleString('default', { month: 'short' })} ${end.getDate()}`;
      }
      return `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}, ${start.getFullYear()}`;
    }
    return 'All Time';
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-forest-deep bg-white border border-outline-variant/30 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="bg-surface-container-high p-1.5 rounded-lg group-hover:bg-primary-container group-hover:text-primary-custom transition-colors">
          <Calendar className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold tracking-wide">{getDisplayLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-outline-variant/30 p-5 z-50 animate-in fade-in zoom-in-95 origin-top-right select-none flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-5 px-2">
            <button 
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => {
                if (tab === 'range') setTab('month');
                else if (tab === 'month') setTab('year');
                else setTab('range');
              }}
              className="font-headline-md text-forest-deep text-lg font-bold px-3 py-1 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              {tab === 'range' && `${viewDate.toLocaleString('default', { month: 'short' })} ${viewDate.getFullYear()}`}
              {tab === 'month' && viewDate.getFullYear()}
              {tab === 'year' && `${years[0]} - ${years[11]}`}
            </button>

            <button 
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="min-h-[220px]">
            {tab === 'range' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2 px-1">
                  {weekDays.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-bold text-on-surface-variant/70">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 gap-x-0 mb-4 px-1">
                  {calendarDays.map((day, idx) => {
                    const { isStart, isEnd, inRange } = getDayState(day.date);
                    const today = isToday(day.date);
                    
                    // We use background blocks to connect ranges visually
                    return (
                      <div key={idx} className={`relative flex items-center justify-center h-10 w-full
                        ${inRange ? 'bg-primary-container/40' : ''}
                        ${isStart && !isEnd ? 'bg-gradient-to-r from-transparent to-primary-container/40' : ''}
                        ${isEnd && !isStart ? 'bg-gradient-to-l from-transparent to-primary-container/40' : ''}
                      `}>
                        <button
                          onClick={() => handleDateClick(day.date)}
                          className={`relative z-10 h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all mx-auto
                            ${!day.isCurrentMonth && !isStart && !isEnd && !inRange ? 'text-outline-variant hover:text-on-surface-variant' : ''}
                            ${day.isCurrentMonth && !isStart && !isEnd && !inRange ? 'text-forest-deep hover:bg-surface-container-high' : ''}
                            ${inRange && !isStart && !isEnd ? 'text-primary-custom hover:bg-primary-custom/10' : ''}
                            ${(isStart || isEnd) ? 'bg-forest-deep text-white shadow-md scale-105' : ''}
                            ${today && !isStart && !isEnd ? 'border-2 border-primary-custom text-primary-custom shadow-[0_0_8px_rgba(255,193,7,0.4)]' : ''}
                          `}
                        >
                          {day.date.getDate()}
                        </button>
                      </div>
                    )
                  })}
                </div>
                {/* Apply Button only needed for range mode */}
                <button 
                  onClick={applyRangeFilter}
                  disabled={!rangeStart}
                  className="w-full bg-gradient-to-r from-forest-deep to-primary-custom text-white font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mb-4"
                >
                  Apply Range Filter
                </button>
              </>
            )}

            {tab === 'month' && (
              <div className="grid grid-cols-3 gap-3 px-2 mb-4">
                {months.map((m, idx) => {
                  const isCurrentMonth = todayDate.getFullYear() === viewDate.getFullYear() && todayDate.getMonth() === idx;
                  const isSelected = filter === 'month' && monthParam === `${viewDate.getFullYear()}-${String(idx + 1).padStart(2, '0')}`;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleMonthClick(idx)}
                      className={`py-4 rounded-xl text-sm font-bold transition-all
                        ${isSelected ? 'bg-forest-deep text-white shadow-md scale-105' : 'bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/20 text-forest-deep'}
                        ${isCurrentMonth && !isSelected ? 'border-2 border-primary-custom shadow-[0_0_8px_rgba(255,193,7,0.3)] text-primary-custom' : ''}
                      `}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            )}

            {tab === 'year' && (
              <div className="grid grid-cols-3 gap-3 px-2 mb-4">
                {years.map((y, idx) => {
                  const isCurrentYear = todayDate.getFullYear() === y;
                  const isSelected = filter === 'year' && yearParam === y.toString();
                  // dim first and last to indicate out of decade bounds
                  const isOutOfBounds = idx === 0 || idx === 11;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleYearClick(y)}
                      className={`py-4 rounded-xl text-sm font-bold transition-all
                        ${isOutOfBounds ? 'opacity-50' : ''}
                        ${isSelected ? 'bg-forest-deep text-white shadow-md scale-105 opacity-100' : 'bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/20 text-forest-deep'}
                        ${isCurrentYear && !isSelected ? 'border-2 border-primary-custom shadow-[0_0_8px_rgba(255,193,7,0.3)] text-primary-custom opacity-100' : ''}
                      `}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="h-px bg-outline-variant/20 mb-4 w-full"></div>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={handleTodayBtn}
              className="py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-forest-deep text-xs font-bold hover:bg-surface-container-high hover:border-primary-custom/50 hover:text-primary-custom transition-all"
            >
              Today
            </button>
            <button 
              onClick={handleThisMonthBtn}
              className="py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-forest-deep text-xs font-bold hover:bg-surface-container-high hover:border-primary-custom/50 hover:text-primary-custom transition-all"
            >
              This Month
            </button>
            <button 
              onClick={handleThisYearBtn}
              className="py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-forest-deep text-xs font-bold hover:bg-surface-container-high hover:border-primary-custom/50 hover:text-primary-custom transition-all"
            >
              This Year
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
