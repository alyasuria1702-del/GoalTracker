'use client'

export async function exportGoalsToPDF(goals, userName) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF()

  doc.setFillColor(59, 130, 246)
  doc.rect(0, 0, 210, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('My Goals', 14, 20)
  doc.setFontSize(11)
  doc.text(`${userName} • ${new Date().toLocaleDateString('ru-RU')}`, 14, 29)

  const rows = goals.map((g) => [
    g.title,
    g.categories?.name || '—',
    g.deadline ? new Date(g.deadline).toLocaleDateString('ru-RU') : '—',
    g.is_completed ? 'Выполнено' : 'Активна',
  ])

  doc.setTextColor(30, 30, 30)
  autoTable(doc, {
    startY: 45,
    head: [['Цель', 'Категория', 'Дедлайн', 'Статус']],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  })

  doc.save(`my-goals-${new Date().toISOString().split('T')[0]}.pdf`)
}
