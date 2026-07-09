import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Truck, 
  Wallet, 
  MapPin, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  X,
  Search,
  Check,
  Smartphone,
  Calendar,
  Layers,
  Fuel,
  Wrench,
  Clock,
  Send,
  Code,
  Copy,
  ChevronRight,
  UserCheck,
  PlusCircle,
  HelpCircle,
  Activity,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { Client, DeliveryPerson, Sale, Product, Vehicle, FleetExpense, CommissionVoucher } from './types';
import { AppProvider, useApp } from './context/AppContext';

// Receipt Modal Component
function Receipt({ sale, client, delivery, product, onDownload, onClose }: { 
  sale: Sale, 
  client?: Client, 
  delivery?: DeliveryPerson,
  product?: Product,
  onDownload: () => void,
  onClose: () => void
}) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const priceTypeLabels: Record<string, string> = {
    varejo_vista: 'Varejo à Vista',
    varejo_prazo: 'Varejo a Prazo',
    atacado_vista: 'Atacado à Vista',
    atacado_prazo: 'Atacado a Prazo'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Visualizar Recibo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-white" ref={receiptRef}>
          <div className="border-2 border-indigo-900 p-5 space-y-4 rounded-lg">
            <div className="text-center pb-3 border-b border-slate-200">
              <h1 className="text-2xl font-black text-indigo-950 tracking-tighter italic">PARCEIROS DA ÁGUA</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Distribuidora de Água</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Cliente</p>
                <p className="font-bold text-slate-800 uppercase">{client?.name || 'Venda Balcão'}</p>
              </div>

              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Endereço de Entrega</p>
                <p className="text-slate-700 font-medium">{client?.address || 'Retirada Direta'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Telefone</p>
                  <p className="text-slate-700 font-bold">{client?.phone || '---'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Data / Hora</p>
                  <p className="text-slate-700 font-medium">
                    {new Date(sale.date).toLocaleDateString('pt-BR')} {new Date(sale.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                <span>Produto & Tipo</span>
                <span>Total</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-800">{product?.name || 'Galão de Água'} (x{sale.quantity})</p>
                  <p className="text-[10px] text-slate-500">{priceTypeLabels[sale.priceType]}</p>
                </div>
                <span className="font-bold text-slate-800">R$ {(sale.quantity * sale.unitPrice).toFixed(2)}</span>
              </div>
              {sale.deliveryFee > 0 && (
                <div className="flex justify-between items-center text-indigo-600 font-semibold pt-1 border-t border-slate-200">
                  <span>Taxa de Entrega</span>
                  <span>+ R$ {sale.deliveryFee.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-between items-end border-t-2 border-dashed border-slate-200 text-xs">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Entregador</p>
                <p className="font-bold text-indigo-700">{delivery?.name || 'Equipe Interna'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Total Pago</p>
                <p className="text-xl font-black text-indigo-950">R$ {sale.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="text-center pt-3 opacity-40">
              <p className="text-[8px] font-bold">Obrigado pela preferência!</p>
              <p className="text-[7px] text-slate-500 mt-0.5">Parceiros da Água System</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 flex gap-3">
          <button 
            onClick={() => {
              if (receiptRef.current) {
                toPng(receiptRef.current, { cacheBust: true })
                  .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `recibo-${client?.name || 'venda'}-${new Date().getTime()}.png`;
                    link.href = dataUrl;
                    link.click();
                    onDownload();
                  })
                  .catch((err) => {
                    console.error('Erro ao gerar recibo em imagem:', err);
                  });
              }
            }}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all text-sm"
          >
            <Download size={16} /> Baixar Foto do Recibo
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Employee Statement Report Modal
function EmployeeReportModal({ employeeId, onClose }: {
  employeeId: string;
  onClose: () => void;
}) {
  const { deliveryPersons, vouchers, completeWeeklyPayment } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const dp = deliveryPersons.find(d => d.id === employeeId);
  if (!dp) return null;

  const courierVouchers = vouchers.filter(v => v.employeeId === dp.id && !v.deletedAt);
  const earned = courierVouchers.filter(v => v.type === 'commission_earn').reduce((sum, v) => sum + v.amount, 0);
  const withdrawn = courierVouchers.filter(v => v.type === 'voucher_withdraw').reduce((sum, v) => sum + v.amount, 0);
  const consumption = courierVouchers.filter(v => v.type === 'consumption_debit').reduce((sum, v) => sum + v.amount, 0);
  const debits = courierVouchers.filter(v => v.type === 'other_debit').reduce((sum, v) => sum + v.amount, 0);
  const paid = courierVouchers.filter(v => v.type === 'weekly_payment').reduce((sum, v) => sum + v.amount, 0);
  const balance = earned - (withdrawn + consumption + debits + paid);

  const salary = dp.weeklySalary || 0;
  const totalEarnings = earned + salary;
  const totalDiscounts = withdrawn + consumption + debits + paid;
  const totalToReceive = salary + balance;

  const typeLabels: Record<string, string> = {
    commission_earn: 'Comissão / Extra',
    voucher_withdraw: 'Vale / Adiantamento',
    consumption_debit: 'Consumo Próprio',
    other_debit: 'Débito Diverso',
    weekly_payment: 'Acerto Pago'
  };

  const downloadReport = (shouldNotify = true) => {
    if (reportRef.current) {
      return toPng(reportRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `extrato-${dp.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.png`;
          link.href = dataUrl;
          link.click();
          if (shouldNotify) {
            alert('Imagem do card de fechamento baixada com sucesso!');
          }
          return true;
        })
        .catch((err) => {
          console.error('Erro ao gerar imagem do extrato:', err);
          alert('Erro ao gerar imagem do extrato.');
          return false;
        });
    }
    return Promise.resolve(false);
  };

  const sendWhatsAppReport = async () => {
    // 1. Download the card image first so the user has the photo saved on their device
    await downloadReport(false);

    // 2. Format the message for WhatsApp (using standard ascii elements for safe encoding across all mobile phones)
    const cleanPhone = dp.phone ? dp.phone.replace(/\D/g, '') : '';
    const targetPhone = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
    
    const formattedTotalToReceive = totalToReceive >= 0 
      ? `[+] R$ ${totalToReceive.toFixed(2)} (A RECEBER)` 
      : `[-] R$ ${Math.abs(totalToReceive).toFixed(2)} (SALDO PENDENTE / DÉBITO)`;

    // Create a list of transactions (showing up to 15 recent items for readability)
    const recentVouchers = courierVouchers.slice(-15);
    const listText = recentVouchers.map(v => {
      const sign = v.type === 'commission_earn' ? '(+)' : '(-)';
      const typeStr = typeLabels[v.type] || 'Lançamento';
      return `* ${new Date(v.date).toLocaleDateString('pt-BR')} | ${typeStr} (${v.description || 'S/ Desc'}): ${sign} R$ ${v.amount.toFixed(2)}`;
    }).join('\n');

    const message = `*📊 EXTRATO DE FECHAMENTO FINANCEIRO - PARCEIROS DA ÁGUA* 💧\n\n` +
      `Olá, *${dp.name}* (Entregador #${dp.number})!\n` +
      `Segue o resumo detalhado das suas movimentações financeiras para conferência e acerto semanal:\n\n` +
      `*💰 CRÉDITOS E GANHOS:*\n` +
      `+ Salário Semanal Fixo: R$ ${salary.toFixed(2)}\n` +
      `+ Comissões Acumuladas: R$ ${earned.toFixed(2)}\n` +
      `👉 *TOTAL DE GANHOS:* R$ ${totalEarnings.toFixed(2)}\n\n` +
      `*📉 DESCONTOS E DÉBITOS:*\n` +
      `- Vales Sacados (Adiantamentos): R$ ${withdrawn.toFixed(2)}\n` +
      `- Consumo Próprio de Água: R$ ${consumption.toFixed(2)}\n` +
      `- Outros Débitos Registrados: R$ ${debits.toFixed(2)}\n` +
      `- Acertos Efetuados (Pagos): R$ ${paid.toFixed(2)}\n` +
      `👉 *DESCONTOS TOTAIS:* R$ ${totalDiscounts.toFixed(2)}\n\n` +
      `==================================\n` +
      `*💵 VALOR TOTAL A RECEBER NESTA SEMANA:*\n` +
      `👉 *${formattedTotalToReceive}*\n` +
      `==================================\n\n` +
      `*📋 ÚLTIMAS TRANSAÇÕES NO EXTRATO:*\n` +
      `${listText || 'Sem transações registradas no período.'}\n\n` +
      `${courierVouchers.length > 15 ? `_e mais ${courierVouchers.length - 15} lançamentos no extrato completo._\n\n` : ''}` +
      `📎 *Instrução:* O *Card Oficial em Foto* foi baixado automaticamente no seu celular ou computador. Ao abrir a conversa do WhatsApp, por favor, *anexe a foto do comprovante* que foi baixada para mantermos o registro de assinaturas!\n\n` +
      `Qualquer dúvida, fale com o administrador. Bom trabalho! 🤝🚀`;

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleWeeklyPaymentAndReset = () => {
    if (totalToReceive >= 0) {
      const confirmMsg = `💵 CONFIRMAR SEMANA PAGA - ${dp.name.toUpperCase()}\n\n` +
        `• Salário Fixo: R$ ${salary.toFixed(2)}\n` +
        `• Saldo de Lançamentos: R$ ${balance.toFixed(2)}\n` +
        `👉 TOTAL A PAGAR AO ENTREGADOR: R$ ${totalToReceive.toFixed(2)}\n\n` +
        `Esta operação de "Semana Paga" irá:\n` +
        `1. Registrar a despesa de R$ ${totalToReceive.toFixed(2)} no caixa da empresa.\n` +
        `2. ZERAR (arquivar) todos os lançamentos desta semana para este funcionário.\n\n` +
        `Deseja prosseguir?`;

      if (!confirm(confirmMsg)) return;

      completeWeeklyPayment(dp.id, totalToReceive, 0);

      alert(`Semana de ${dp.name} finalizada com sucesso! Todos os saldos foram liquidados e zerados.`);
      onClose();
    } else {
      // Employee is in debt (totalToReceive < 0)
      const debtAmount = Math.abs(totalToReceive);
      const confirmMsg = `⚠️ ALERTA DE SALDO DEVEDOR - ${dp.name.toUpperCase()}\n\n` +
        `• Salário Fixo: R$ ${salary.toFixed(2)}\n` +
        `• Saldo de Lançamentos: R$ ${balance.toFixed(2)}\n` +
        `👉 VALOR DEVEDOR: - R$ ${debtAmount.toFixed(2)}\n\n` +
        `O entregador ficou devendo R$ ${debtAmount.toFixed(2)}!\n\n` +
        `Como ele ficou devendo, esta operação de "Semana Paga" irá:\n` +
        `1. ZERAR (arquivar) todos os lançamentos atuais desta semana.\n` +
        `2. LANÇAR AUTOMATICAMENTE um débito de R$ ${debtAmount.toFixed(2)} para a próxima semana, detalhado no histórico.\n\n` +
        `Deseja prosseguir com o fechamento?`;

      if (!confirm(confirmMsg)) return;

      completeWeeklyPayment(dp.id, 0, debtAmount);

      alert(`Semana finalizada! O saldo devedor de R$ ${debtAmount.toFixed(2)} foi lançado para a próxima semana.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden my-8"
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Holerite / Extrato de Fechamento</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{dp.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-100 max-h-[65vh] overflow-y-auto">
          {/* Card Wrapper for screenshot */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60 space-y-6" ref={reportRef}>
            
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">PARCEIROS DA ÁGUA</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Comprovante de Conta Corrente</p>
              <div className="mt-3 py-2 px-3 bg-slate-50 border border-slate-100 rounded text-left text-xs space-y-1 text-slate-600">
                <p><strong>Colaborador:</strong> Entregador #{dp.number} - {dp.name}</p>
                <p><strong>Telefone:</strong> {dp.phone || 'Não informado'}</p>
                <p><strong>Gerado em:</strong> {new Date().toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Demonstrativo Detalhado</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Comissões (+)</span>
                  <span className="font-bold text-emerald-700 text-xs">R$ {earned.toFixed(2)}</span>
                </div>
                <div className="p-2 bg-rose-50 rounded border border-rose-100">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Vales Sacados (-)</span>
                  <span className="font-bold text-rose-700 text-xs">R$ {withdrawn.toFixed(2)}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-100">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Consumo Próprio (-)</span>
                  <span className="font-bold text-amber-700 text-xs">R$ {consumption.toFixed(2)}</span>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-100">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Outros Débitos (-)</span>
                  <span className="font-bold text-purple-700 text-xs">R$ {debits.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-2 bg-blue-50 rounded border border-blue-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[8px] uppercase font-bold">Acertos Efetuados (-)</span>
                  <span className="font-bold text-blue-700 text-xs">R$ {paid.toFixed(2)}</span>
                </div>
              </div>

              {/* DRE / Resumo Consolidado (Demandado pelo usuário: Salário, Descontos Totais e Total a Receber) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Salário Semanal (+)</span>
                  <span>R$ {salary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Comissões Acumuladas (+)</span>
                  <span>R$ {earned.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-rose-600 font-bold border-b border-dashed border-slate-200 pb-1.5">
                  <span>Descontos Totais (-)</span>
                  <span>- R$ {totalDiscounts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-800 block">Total a Receber (=)</span>
                    <span className="text-[8px] text-slate-400 block font-semibold leading-none">Salário + Saldo Líquido</span>
                  </div>
                  <span className={`text-base font-black tracking-tight ${totalToReceive >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {totalToReceive.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 text-white rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase font-bold">Saldo de Lançamentos (=)</span>
                  <p className="text-[8px] text-slate-400">Comissões menos descontos</p>
                </div>
                <span className={`text-sm font-black tracking-tight ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {balance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Complete Ledger List */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Histórico de Transações</p>
              
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {courierVouchers.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-4 italic bg-slate-50 rounded">Nenhuma transação registrada.</p>
                ) : (
                  courierVouchers.map(v => (
                    <div key={v.id} className="flex justify-between items-center text-[11px] p-2 bg-slate-50 rounded border border-slate-100">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className={`px-1 py-0.2 rounded text-[8px] uppercase font-bold ${
                            v.type === 'commission_earn' ? 'bg-emerald-100 text-emerald-800' :
                            v.type === 'voucher_withdraw' ? 'bg-rose-100 text-rose-800' :
                            v.type === 'consumption_debit' ? 'bg-amber-100 text-amber-800' :
                            v.type === 'other_debit' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {typeLabels[v.type]}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(v.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="font-medium text-slate-700">{v.description}</p>
                      </div>
                      <span className={`font-bold ${v.type === 'commission_earn' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {v.type === 'commission_earn' ? '+' : '-'} R$ {v.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center text-[9px] text-slate-400 mt-4">
              <div className="space-y-4">
                <div className="border-b border-slate-200 h-6"></div>
                <p className="font-bold uppercase">Assinatura do Gerente</p>
              </div>
              <div className="space-y-4">
                <div className="border-b border-slate-200 h-6"></div>
                <p className="font-bold uppercase">Assinatura do Colaborador</p>
              </div>
            </div>

            <p className="text-center text-[8px] text-slate-400 italic">Parceiros da Água - Perfeito controle financeiro sem perdas.</p>

          </div>
        </div>

        {/* Action Guide Text */}
        <div className="px-6 py-2.5 bg-indigo-50 border-t border-indigo-100 text-[11px] text-indigo-750 font-medium space-y-0.5">
          <p className="font-bold text-indigo-900">💡 Instrução de Envio:</p>
          <p>Ao clicar em <strong>Enviar para o Funcionário (WhatsApp)</strong>, o sistema baixará a imagem do card de fechamento e abrirá a conversa do WhatsApp com o texto formatado. Basta anexar o card em foto que foi baixado!</p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleWeeklyPaymentAndReset}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Check size={14} /> Semana Paga (Zerar)
          </button>

          <button 
            onClick={sendWhatsAppReport}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Send size={14} /> Enviar para o Funcionário (WhatsApp)
          </button>
          
          <button 
            onClick={() => downloadReport(true)}
            className="bg-slate-850 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Download size={14} /> Apenas Baixar Foto
          </button>

          <button 
            onClick={onClose}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs uppercase transition-all"
          >
            Fechar
          </button>
        </div>

      </motion.div>
    </div>
  );
}

// Employee Edit Modal - Allows editing everything on the card
function EmployeeEditModal({ employeeId, onClose }: {
  employeeId: string;
  onClose: () => void;
}) {
  const { 
    deliveryPersons, 
    vouchers, 
    updateDeliveryPerson, 
    updateVoucher, 
    deleteVoucher, 
    addVoucher, 
    deleteDeliveryPerson 
  } = useApp();
  
  const dp = deliveryPersons.find(d => d.id === employeeId);
  if (!dp) return null;

  // Local state for the delivery person fields
  const [name, setName] = useState(dp.name);
  const [phone, setPhone] = useState(dp.phone || '');
  const [weeklySalary, setWeeklySalary] = useState(dp.weeklySalary || 0);

  // Vouchers belonging to this delivery person
  const courierVouchers = vouchers.filter(v => v.employeeId === dp.id && !v.deletedAt);

  // Local state for adding a new transaction
  const [newVoucherDate, setNewVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [newVoucherType, setNewVoucherType] = useState<'commission_earn' | 'voucher_withdraw' | 'consumption_debit' | 'other_debit' | 'weekly_payment'>('voucher_withdraw');
  const [newVoucherDescription, setNewVoucherDescription] = useState('');
  const [newVoucherAmount, setNewVoucherAmount] = useState('');

  // Local states for editing transactions
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);
  const [editVoucherDate, setEditVoucherDate] = useState('');
  const [editVoucherType, setEditVoucherType] = useState<'commission_earn' | 'voucher_withdraw' | 'consumption_debit' | 'other_debit' | 'weekly_payment'>('commission_earn');
  const [editVoucherDescription, setEditVoucherDescription] = useState('');
  const [editVoucherAmount, setEditVoucherAmount] = useState(0);

  const typeLabels: Record<string, string> = {
    commission_earn: 'Comissão / Extra (+)',
    voucher_withdraw: 'Vale / Adiantamento (-)',
    consumption_debit: 'Consumo Próprio (-)',
    other_debit: 'Débito Diverso (-)',
    weekly_payment: 'Acerto Pago (-)'
  };

  const handleSaveDeliverer = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliveryPerson({
      ...dp,
      name,
      phone,
      weeklySalary: Number(weeklySalary)
    });
    alert("Dados do entregador atualizados com sucesso!");
  };

  const handleDeleteEmployee = () => {
    if (confirm(`⚠️ ATENÇÃO PERIGO! Tem certeza de que deseja EXCLUIR PERMANENTEMENTE o entregador "${dp.name}"? Essa ação removerá o entregador e todos os seus lançamentos do sistema de forma irreversível.`)) {
      deleteDeliveryPerson(dp.id);
      alert("Entregador excluído permanentemente!");
      onClose();
    }
  };

  const handleAddNewVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherAmount || Number(newVoucherAmount) <= 0) {
      alert("Por favor, digite um valor maior que zero.");
      return;
    }

    const defaultDescriptions: Record<string, string> = {
      commission_earn: 'Comissão / Lançamento Extra',
      voucher_withdraw: 'Vale de Adiantamento solicitado',
      consumption_debit: 'Débito de Consumo Próprio',
      other_debit: 'Débito Diverso registrado',
      weekly_payment: 'Acerto de Contas Semanal Pago'
    };

    const finalDescription = newVoucherDescription.trim() || defaultDescriptions[newVoucherType];

    addVoucher({
      employeeId: dp.id,
      date: new Date(newVoucherDate + 'T12:00:00').toISOString(),
      type: newVoucherType,
      description: finalDescription,
      amount: Number(newVoucherAmount)
    });

    setNewVoucherDescription('');
    setNewVoucherAmount('');
    alert("Novo lançamento cadastrado com sucesso!");
  };

  const startEditVoucher = (v: CommissionVoucher) => {
    setEditingVoucherId(v.id);
    setEditVoucherDate(v.date.split('T')[0]);
    setEditVoucherType(v.type);
    setEditVoucherDescription(v.description);
    setEditVoucherAmount(v.amount);
  };

  const saveEditedVoucher = () => {
    if (!editingVoucherId) return;
    const original = vouchers.find(v => v.id === editingVoucherId);
    if (!original) return;

    updateVoucher({
      ...original,
      date: new Date(editVoucherDate + 'T12:00:00').toISOString(),
      type: editVoucherType,
      description: editVoucherDescription,
      amount: Number(editVoucherAmount)
    });

    setEditingVoucherId(null);
    alert("Lançamento atualizado com sucesso!");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Painel de Edição Completa do Card</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Entregador #{dp.number} - {dp.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 1. SEÇÃO CADASTRO DO ENTREGADOR */}
          <form onSubmit={handleSaveDeliverer} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider pb-2 border-b border-slate-100">1. Dados de Identificação e Salário</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nome Completo</label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Telefone</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Salário Semanal (R$)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={weeklySalary}
                  onChange={e => setWeeklySalary(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-100/50">
              <button 
                type="button"
                onClick={handleDeleteEmployee}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs uppercase transition-all shadow-sm flex items-center gap-1"
              >
                Excluir Funcionário
              </button>

              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs uppercase transition-all shadow-sm"
              >
                Salvar Cadastro & Salário
              </button>
            </div>
          </form>

          {/* 2. SEÇÃO ADICIONAR NOVO LANÇAMENTO (SOLICITADO PELO USUÁRIO) */}
          <form onSubmit={handleAddNewVoucher} className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100 space-y-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider pb-2 border-b border-emerald-100">2. Adicionar Lançamento (Vale, Saída, Comissão, Consumo)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Data</label>
                <input 
                  type="date"
                  value={newVoucherDate}
                  onChange={e => setNewVoucherDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Tipo</label>
                <select 
                  value={newVoucherType}
                  onChange={e => setNewVoucherType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-700"
                  required
                >
                  <option value="voucher_withdraw">Vale / Adiantamento (-)</option>
                  <option value="consumption_debit">Consumo Próprio (-)</option>
                  <option value="commission_earn">Comissão / Extra (+)</option>
                  <option value="other_debit">Débito Diverso (-)</option>
                  <option value="weekly_payment">Acerto Pago (-)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Descrição (Opcional)</label>
                <input 
                  type="text"
                  placeholder="Ex: Vale Quarta / Extra Sabado"
                  value={newVoucherDescription}
                  onChange={e => setNewVoucherDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Valor (R$)</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newVoucherAmount}
                  onChange={e => setNewVoucherAmount(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs uppercase transition-all shadow-sm"
              >
                Confirmar Lançamento
              </button>
            </div>
          </form>

          {/* 3. SEÇÃO HISTÓRICO DE LANÇAMENTOS (ENTRADAS E SAÍDAS) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Editar Transações Cadastradas</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{courierVouchers.length} lançamentos</span>
            </div>

            {editingVoucherId && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-3">
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide font-mono">Editando Lançamento Selecionado</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Data</label>
                    <input 
                      type="date"
                      value={editVoucherDate}
                      onChange={e => setEditVoucherDate(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Tipo</label>
                    <select 
                      value={editVoucherType}
                      onChange={e => setEditVoucherType(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="commission_earn">Comissão / Extra (+)</option>
                      <option value="voucher_withdraw">Vale / Adiantamento (-)</option>
                      <option value="consumption_debit">Consumo Próprio (-)</option>
                      <option value="other_debit">Débito Diverso (-)</option>
                      <option value="weekly_payment">Acerto Pago (-)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Descrição</label>
                    <input 
                      type="text"
                      value={editVoucherDescription}
                      onChange={e => setEditVoucherDescription(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Valor (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={editVoucherAmount}
                      onChange={e => setEditVoucherAmount(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-amber-100">
                  <button 
                    type="button"
                    onClick={() => setEditingVoucherId(null)}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button"
                    onClick={saveEditedVoucher}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg text-[10px] uppercase transition-all shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
              {courierVouchers.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-xl">Não há lançamentos de comissão, vales ou débitos.</p>
              ) : (
                courierVouchers.map(v => (
                  <div key={v.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 transition-all">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1 py-0.2 rounded text-[8px] uppercase font-bold ${
                          v.type === 'commission_earn' ? 'bg-emerald-100 text-emerald-800' :
                          v.type === 'voucher_withdraw' ? 'bg-rose-100 text-rose-800' :
                          v.type === 'consumption_debit' ? 'bg-amber-100 text-amber-800' :
                          v.type === 'other_debit' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {typeLabels[v.type]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(v.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="font-bold text-slate-750">{v.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-xs ${v.type === 'commission_earn' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {v.type === 'commission_earn' ? '+' : '-'} R$ {v.amount.toFixed(2)}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => startEditVoucher(v)}
                          className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-white border border-transparent hover:border-slate-200"
                          title="Editar"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Tem certeza de que deseja excluir permanentemente o lançamento de R$ ${v.amount.toFixed(2)}?`)) {
                              deleteVoucher(v.id);
                              alert("Lançamento removido!");
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-white border border-transparent hover:border-slate-200"
                          title="Excluir"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase transition-all"
          >
            Fechar Janela
          </button>
        </div>

      </motion.div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color, subValue, subColor }: { title: string, value: string | number, icon: any, color: string, subValue?: string, subColor?: string }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{title}</p>
        <div className={`${color} text-white p-2 rounded-lg`}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
        {subValue && <p className={`text-xs mt-1 font-medium ${subColor || 'text-slate-500'}`}>{subValue}</p>}
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addProduct, updateProduct } = useApp();
  
  const [name, setName] = useState(product ? product.name : '');
  
  // Fardo and unit cost states (graceful fallback for older items)
  const [fardoQuantity, setFardoQuantity] = useState<number>(product?.fardoQuantity || 12);
  const [fardoCost, setFardoCost] = useState<number>(
    product?.fardoCost || (product ? Number((product.unitCost * (product.fardoQuantity || 12)).toFixed(2)) : 12)
  );

  // Helper calculations
  const unitCost = fardoQuantity > 0 ? Number((fardoCost / fardoQuantity).toFixed(4)) : 0;

  const getMargin = (price: number, cost: number) => {
    if (!cost || cost <= 0) return 0;
    return Number((((price / cost) - 1) * 100).toFixed(1));
  };

  const getPriceFromMargin = (cost: number, margin: number) => {
    return Number((cost * (1 + margin / 100)).toFixed(2));
  };

  // Bidirectional states for the 4 pricing categories
  const [marginVV, setMarginVV] = useState<number>(product ? getMargin(product.priceVarejoVista, product.unitCost) : 150);
  const [priceVV, setPriceVV] = useState<number>(product ? product.priceVarejoVista : 2.5);

  const [marginVP, setMarginVP] = useState<number>(product ? getMargin(product.priceVarejoPrazo, product.unitCost) : 180);
  const [priceVP, setPriceVP] = useState<number>(product ? product.priceVarejoPrazo : 2.8);

  const [marginAV, setMarginAV] = useState<number>(product ? getMargin(product.priceAtacadoVista, product.unitCost) : 100);
  const [priceAV, setPriceAV] = useState<number>(product ? product.priceAtacadoVista : 2.0);

  const [marginAP, setMarginAP] = useState<number>(product ? getMargin(product.priceAtacadoPrazo, product.unitCost) : 120);
  const [priceAP, setPriceAP] = useState<number>(product ? product.priceAtacadoPrazo : 2.2);

  // Cost and Quantity handlers
  const handleFardoCostChange = (cost: number) => {
    setFardoCost(cost);
    const calculatedUnitCost = fardoQuantity > 0 ? cost / fardoQuantity : 0;
    // Recalculate selling prices based on current margins
    setPriceVV(Number(getPriceFromMargin(calculatedUnitCost, marginVV)));
    setPriceVP(Number(getPriceFromMargin(calculatedUnitCost, marginVP)));
    setPriceAV(Number(getPriceFromMargin(calculatedUnitCost, marginAV)));
    setPriceAP(Number(getPriceFromMargin(calculatedUnitCost, marginAP)));
  };

  const handleFardoQuantityChange = (qty: number) => {
    setFardoQuantity(qty);
    const calculatedUnitCost = qty > 0 ? fardoCost / qty : 0;
    // Recalculate selling prices based on current margins
    setPriceVV(Number(getPriceFromMargin(calculatedUnitCost, marginVV)));
    setPriceVP(Number(getPriceFromMargin(calculatedUnitCost, marginVP)));
    setPriceAV(Number(getPriceFromMargin(calculatedUnitCost, marginAV)));
    setPriceAP(Number(getPriceFromMargin(calculatedUnitCost, marginAP)));
  };

  // Varejo Vista
  const handlePriceVVChange = (price: number) => {
    setPriceVV(price);
    if (unitCost > 0) {
      setMarginVV(Number(getMargin(price, unitCost)));
    }
  };
  const handleMarginVVChange = (margin: number) => {
    setMarginVV(margin);
    if (unitCost > 0) {
      setPriceVV(Number(getPriceFromMargin(unitCost, margin)));
    }
  };

  // Varejo Prazo
  const handlePriceVPChange = (price: number) => {
    setPriceVP(price);
    if (unitCost > 0) {
      setMarginVP(Number(getMargin(price, unitCost)));
    }
  };
  const handleMarginVPChange = (margin: number) => {
    setMarginVP(margin);
    if (unitCost > 0) {
      setPriceVP(Number(getPriceFromMargin(unitCost, margin)));
    }
  };

  // Atacado Vista
  const handlePriceAVChange = (price: number) => {
    setPriceAV(price);
    if (unitCost > 0) {
      setMarginAV(Number(getMargin(price, unitCost)));
    }
  };
  const handleMarginAVChange = (margin: number) => {
    setMarginAV(margin);
    if (unitCost > 0) {
      setPriceAV(Number(getPriceFromMargin(unitCost, margin)));
    }
  };

  // Atacado Prazo
  const handlePriceAPChange = (price: number) => {
    setPriceAP(price);
    if (unitCost > 0) {
      setMarginAP(Number(getMargin(price, unitCost)));
    }
  };
  const handleMarginAPChange = (margin: number) => {
    setMarginAP(margin);
    if (unitCost > 0) {
      setPriceAP(Number(getPriceFromMargin(unitCost, margin)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, insira o nome do produto.");
      return;
    }

    const productData = {
      name: name.trim(),
      unitCost: Number(unitCost),
      priceVarejoVista: Number(priceVV),
      priceVarejoPrazo: Number(priceVP),
      priceAtacadoVista: Number(priceAV),
      priceAtacadoPrazo: Number(priceAP),
      fardoCost: Number(fardoCost),
      fardoQuantity: Number(fardoQuantity)
    };

    if (product) {
      updateProduct({
        ...product,
        ...productData
      });
      alert("Produto atualizado com sucesso!");
    } else {
      addProduct(productData);
      alert("Produto cadastrado com sucesso!");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden my-8 border border-slate-100"
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="text-indigo-600" size={18} />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {product ? "Editar Produto / Embalagem" : "Adicionar Novo Produto"}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Nome do Produto */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome da Embalagem / Produto *</label>
            <input 
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: 510 ML COM GÁS"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold uppercase transition-all"
            />
          </div>

          {/* Card de Custo de Compra (Fardo) */}
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/40 pb-2">
              <span className="p-1 bg-indigo-100 text-indigo-700 rounded text-xs font-black">CUSTO</span>
              <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Custo de Compra (Aquisição)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Preço do Fardo (Custo) *</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={fardoCost}
                  onChange={e => handleFardoCostChange(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Quantidade de Unidades *</label>
                <input 
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={fardoQuantity}
                  onChange={e => handleFardoQuantityChange(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Custo Unitário (un)</label>
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-black rounded-lg text-xs text-center">
                  R$ {unitCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-100 my-2"></div>

          {/* ESPAÇO EM CADA PRECIFICAÇÃO - Precificações Separadas com muito espaço */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={14} /> Variações de Preços de Venda & Margem de Lucro
            </h4>

            {/* 1. Varejo à Vista */}
            <div className="bg-emerald-50/20 border border-emerald-100 p-4 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-emerald-100/50 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h5 className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">Varejo à Vista</h5>
                </div>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Faturamento Imediato</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-emerald-700 uppercase">Margem de Lucro (%)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      value={marginVV}
                      onChange={e => handleMarginVVChange(Number(e.target.value))}
                      className="w-full p-2.5 pr-6 border border-emerald-200/80 rounded-lg text-xs bg-white text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-emerald-600 font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-emerald-700 uppercase">Valor Unitário da Garrafa (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={priceVV}
                    onChange={e => handlePriceVVChange(Number(e.target.value))}
                    className="w-full p-2.5 border border-emerald-200/80 rounded-lg text-xs bg-emerald-50/50 text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-emerald-700 uppercase">Valor de Venda do Fardo</label>
                  <div className="p-2.5 bg-emerald-600 text-white font-black rounded-lg text-xs text-center border border-emerald-700 shadow-sm">
                    R$ {(priceVV * fardoQuantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Varejo a Prazo */}
            <div className="bg-teal-50/20 border border-teal-100 p-4 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-teal-100/50 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <h5 className="text-[11px] font-black text-teal-800 uppercase tracking-wider">Varejo a Prazo</h5>
                </div>
                <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase">Faturamento Agendado</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-teal-700 uppercase">Margem de Lucro (%)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      value={marginVP}
                      onChange={e => handleMarginVPChange(Number(e.target.value))}
                      className="w-full p-2.5 pr-6 border border-teal-200/80 rounded-lg text-xs bg-white text-teal-800 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-teal-600 font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-teal-700 uppercase">Valor Unitário da Garrafa (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={priceVP}
                    onChange={e => handlePriceVPChange(Number(e.target.value))}
                    className="w-full p-2.5 border border-teal-200/80 rounded-lg text-xs bg-teal-50/50 text-teal-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-teal-700 uppercase">Valor de Venda do Fardo</label>
                  <div className="p-2.5 bg-teal-600 text-white font-black rounded-lg text-xs text-center border border-teal-700 shadow-sm">
                    R$ {(priceVP * fardoQuantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Atacado à Vista */}
            <div className="bg-indigo-50/20 border border-indigo-100 p-4 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h5 className="text-[11px] font-black text-indigo-800 uppercase tracking-wider">Atacado à Vista</h5>
                </div>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Volume Imediato</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-indigo-700 uppercase">Margem de Lucro (%)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      value={marginAV}
                      onChange={e => handleMarginAVChange(Number(e.target.value))}
                      className="w-full p-2.5 pr-6 border border-indigo-200/80 rounded-lg text-xs bg-white text-indigo-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-indigo-600 font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-indigo-700 uppercase">Valor Unitário da Garrafa (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={priceAV}
                    onChange={e => handlePriceAVChange(Number(e.target.value))}
                    className="w-full p-2.5 border border-indigo-200/80 rounded-lg text-xs bg-indigo-50/50 text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-indigo-700 uppercase">Valor de Venda do Fardo</label>
                  <div className="p-2.5 bg-indigo-600 text-white font-black rounded-lg text-xs text-center border border-indigo-700 shadow-sm">
                    R$ {(priceAV * fardoQuantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Atacado a Prazo */}
            <div className="bg-violet-50/20 border border-violet-100 p-4 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-violet-100/50 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                  <h5 className="text-[11px] font-black text-violet-800 uppercase tracking-wider">Atacado a Prazo</h5>
                </div>
                <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase">Volume com Prazo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-violet-700 uppercase">Margem de Lucro (%)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      value={marginAP}
                      onChange={e => handleMarginAPChange(Number(e.target.value))}
                      className="w-full p-2.5 pr-6 border border-violet-200/80 rounded-lg text-xs bg-white text-violet-800 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-violet-600 font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-violet-700 uppercase">Valor Unitário da Garrafa (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={priceAP}
                    onChange={e => handlePriceAPChange(Number(e.target.value))}
                    className="w-full p-2.5 border border-violet-200/80 rounded-lg text-xs bg-violet-50/50 text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-violet-700 uppercase">Valor de Venda do Fardo</label>
                  <div className="p-2.5 bg-violet-600 text-white font-black rounded-lg text-xs text-center border border-violet-700 shadow-sm">
                    R$ {(priceAP * fardoQuantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 p-4 -mx-6 -mb-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 font-black rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              {product ? "Salvar Alterações" : "Adicionar Produto"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'order_flow' | 'clients' | 'products' | 'logistics' | 'vales_comissoes' | 'fleet' | 'supabase_setup'>('dashboard');
  const { 
    clients, 
    sectors, 
    deliveryPersons, 
    products, 
    sales, 
    expenses, 
    vehicles, 
    fleetExpenses, 
    vouchers, 
    partners,
    addClient,
    updateClient,
    deleteClient,
    addSale,
    updateSaleStatus,
    deleteSale,
    addExpense,
    deleteExpense,
    addSector,
    addDeliveryPerson,
    updateDeliveryPerson,
    addProduct,
    updateProduct,
    deleteProduct,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addFleetExpense,
    deleteFleetExpense,
    addVoucher,
    updateVoucher,
    deleteVoucher,
    weeklyClosure,
    completeWeeklyPayment,
    updatePartner,
    resetAllData
  } = useApp();

  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Sale | null>(null);
  
  // States for employee ledger search, filtering, and report modal
  const [selectedEmployeeForReport, setSelectedEmployeeForReport] = useState<string | null>(null);
  const [editingEmployeeIdForCard, setEditingEmployeeIdForCard] = useState<string | null>(null);
  const [ledgerFilterType, setLedgerFilterType] = useState<string>('all');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');

  // States for soft delete visibility
  const [showDeletedClients, setShowDeletedClients] = useState(false);
  const [showDeletedProducts, setShowDeletedProducts] = useState(false);
  const [showDeletedSales, setShowDeletedSales] = useState(false);

  // States for product adding/editing modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const [newSale, setNewSale] = useState<{
    clientId: string;
    productId: string;
    quantity: number;
    deliveryPersonId: string;
    deliveryFee: number;
    atacadoVarejo: 'varejo' | 'atacado';
    vistaPrazo: 'vista' | 'prazo';
  }>({
    clientId: '',
    productId: '',
    quantity: 1,
    deliveryPersonId: '',
    deliveryFee: 0,
    atacadoVarejo: 'varejo',
    vistaPrazo: 'vista'
  });

  // ------------------------------------------------------------------------
  // FINANCIAL MATHS (FÓRMULAS ESTRITAS)
  // ------------------------------------------------------------------------
  
  // All active records
  const activeSales = sales.filter(s => !s.deletedAt && s.status !== 'canceled');
  const activeExpenses = expenses.filter(e => !e.deletedAt);
  const activeFleetExpenses = fleetExpenses.filter(fe => !fe.deletedAt);
  const activeVouchers = vouchers.filter(v => !v.deletedAt);

  // Total Entradas (Entregas e vendas confirmadas/pendentes)
  const totalInflow = activeSales.reduce((sum, s) => sum + s.totalAmount, 0);
  
  // Expenses sum
  const totalGeneralExpenses = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFleetExpenses = activeFleetExpenses.reduce((sum, fe) => sum + fe.amount, 0);
  
  // Commissions & Vouchers paid sum
  const totalCommissionsEarned = activeVouchers.filter(v => v.type === 'commission_earn').reduce((sum, v) => sum + v.amount, 0);
  const totalVouchersWithdrawn = activeVouchers.filter(v => v.type === 'voucher_withdraw').reduce((sum, v) => sum + v.amount, 0);
  
  // FORMULA ESTRITA: (Todas as Entradas) - (Despesas Gerais + Gastos de Frota + Comissões + Vales pagos) = Lucro Líquido
  // Let's use the actual payout logic. Vales pagos correspond to voucher_withdraw.
  // Wait, let's look at the instruction:
  // "Divisão de Lucro (Sócios): A aba de Lucros deve isolar o resultado líquido. A fórmula estrita é: (Todas as Entradas) - (Despesas Gerais + Gastos de Frota + Comissões + Vales pagos) = Lucro Líquido"
  const totalDeductions = totalGeneralExpenses + totalFleetExpenses + totalCommissionsEarned + totalVouchersWithdrawn;
  const netProfit = Math.max(0, totalInflow - totalDeductions);

  // Active deliveries
  const activeDeliveriesCount = deliveryPersons.filter(dp => dp.status === 'active' && !dp.deletedAt).length;

  const handleWeeklyPaymentAndResetInDashboard = (dpId: string) => {
    const dp = deliveryPersons.find(d => d.id === dpId);
    if (!dp) return;

    const courierVouchers = vouchers.filter(v => v.employeeId === dpId && !v.deletedAt);
    const earned = courierVouchers.filter(v => v.type === 'commission_earn').reduce((sum, v) => sum + v.amount, 0);
    const withdrawn = courierVouchers.filter(v => v.type === 'voucher_withdraw').reduce((sum, v) => sum + v.amount, 0);
    const consumption = courierVouchers.filter(v => v.type === 'consumption_debit').reduce((sum, v) => sum + v.amount, 0);
    const debits = courierVouchers.filter(v => v.type === 'other_debit').reduce((sum, v) => sum + v.amount, 0);
    const paid = courierVouchers.filter(v => v.type === 'weekly_payment').reduce((sum, v) => sum + v.amount, 0);
    
    const outstandingBalance = earned - (withdrawn + consumption + debits + paid);
    const salary = dp.weeklySalary || 0;
    const totalToReceive = salary + outstandingBalance;

    if (totalToReceive >= 0) {
      const confirmMsg = `💵 CONFIRMAR SEMANA PAGA - ${dp.name.toUpperCase()}\n\n` +
        `• Salário Fixo: R$ ${salary.toFixed(2)}\n` +
        `• Saldo de Lançamentos: R$ ${outstandingBalance.toFixed(2)}\n` +
        `👉 TOTAL A PAGAR AO ENTREGADOR: R$ ${totalToReceive.toFixed(2)}\n\n` +
        `Esta operação de "Semana Paga" irá:\n` +
        `1. Registrar a despesa de R$ ${totalToReceive.toFixed(2)} no caixa da empresa.\n` +
        `2. ZERAR (arquivar) todos os lançamentos desta semana para este funcionário.\n\n` +
        `Deseja prosseguir?`;

      if (!confirm(confirmMsg)) return;

      completeWeeklyPayment(dp.id, totalToReceive, 0);

      alert(`Semana de ${dp.name} finalizada com sucesso! Todos os saldos foram liquidados e zerados.`);
    } else {
      // Employee is in debt (totalToReceive < 0)
      const debtAmount = Math.abs(totalToReceive);
      const confirmMsg = `⚠️ ALERTA DE SALDO DEVEDOR - ${dp.name.toUpperCase()}\n\n` +
        `• Salário Fixo: R$ ${salary.toFixed(2)}\n` +
        `• Saldo de Lançamentos: R$ ${outstandingBalance.toFixed(2)}\n` +
        `👉 VALOR DEVEDOR: - R$ ${debtAmount.toFixed(2)}\n\n` +
        `O entregador ficou devendo R$ ${debtAmount.toFixed(2)}!\n\n` +
        `Como ele ficou devendo, esta operação de "Semana Paga" irá:\n` +
        `1. ZERAR (arquivar) todos os lançamentos atuais desta semana.\n` +
        `2. LANÇAR AUTOMATICAMENTE um débito de R$ ${debtAmount.toFixed(2)} para a próxima semana, detalhado no histórico.\n\n` +
        `Deseja prosseguir com o fechamento?`;

      if (!confirm(confirmMsg)) return;

      completeWeeklyPayment(dp.id, 0, debtAmount);

      alert(`Semana finalizada! O saldo devedor de R$ ${debtAmount.toFixed(2)} foi lançado para a próxima semana.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-lg font-black text-emerald-400 tracking-tight flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-900 px-2 py-0.5 rounded italic">P</span>
              PARCEIROS DA ÁGUA
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão & Distribuição</p>
          </div>
          
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard size={18} /> Visão Geral
            </button>
            
            <button 
              onClick={() => setActiveTab('order_flow')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'order_flow' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <ShoppingCart size={18} /> Lançar Pedido
            </button>

            <button 
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'clients' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Users size={18} /> Clientes & Setores
            </button>

            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Layers size={18} /> Catálogo de Preços
            </button>

            <button 
              onClick={() => setActiveTab('logistics')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'logistics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <MapPin size={18} /> Rotas Inteligentes
            </button>

            <button 
              onClick={() => setActiveTab('vales_comissoes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'vales_comissoes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Wallet size={18} /> Card de Vales & Equipe
            </button>

            <button 
              onClick={() => setActiveTab('fleet')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'fleet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Truck size={18} /> Gestão de Frota
            </button>

            <div className="pt-4 border-t border-slate-800 mt-4">
              <button 
                onClick={() => setActiveTab('supabase_setup')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all text-left ${activeTab === 'supabase_setup' ? 'bg-indigo-950 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
              >
                <Code size={14} /> SCRIPT SQL SUPABASE
              </button>
            </div>
          </nav>
        </div>

        {/* BOTTOM METRICS CONTAINER */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
          <div className="flex justify-between items-center mb-1">
            <span>Servidor Supabase</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Conectado
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Modo Local Storage</span>
            <span className="text-indigo-400 font-bold uppercase">Ativo</span>
          </div>
          <div className="mt-3">
            <button 
              onClick={() => {
                if(confirm("Deseja redefinir os dados para os valores padrão do sistema?")) {
                  resetAllData();
                }
              }}
              className="w-full text-center text-red-400/80 hover:text-red-300 transition-colors font-semibold"
            >
              Zerar/Restaurar Padrões
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: VISÃO GERAL (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Painel de Controle Operacional</h2>
                  <p className="text-sm text-slate-500">Métricas consolidadas com a fórmula estrita de divisão de lucros.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" /> Fechamento Semanal: Sextas-feiras
                  </div>
                </div>
              </div>

              {/* HIGH LEVEL STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard 
                  title="Faturamento Bruto (Entradas)" 
                  value={`R$ ${totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={TrendingUp} 
                  color="bg-emerald-500" 
                  subValue={`${activeSales.length} entregas ativas`}
                />
                <StatsCard 
                  title="Despesas Operacionais" 
                  value={`R$ ${(totalGeneralExpenses + totalFleetExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={DollarSign} 
                  color="bg-rose-500" 
                  subValue={`Gerais: R$ ${totalGeneralExpenses.toFixed(2)} | Frota: R$ ${totalFleetExpenses.toFixed(2)}`}
                />
                <StatsCard 
                  title="Comissões & Vales Pagos" 
                  value={`R$ ${(totalCommissionsEarned + totalVouchersWithdrawn).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={Wallet} 
                  color="bg-amber-500" 
                  subValue={`Comissão: R$ ${totalCommissionsEarned.toFixed(2)} | Vales: R$ ${totalVouchersWithdrawn.toFixed(2)}`}
                />
                <StatsCard 
                  title="Lucro Líquido Real" 
                  value={`R$ ${netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={TrendingUp} 
                  color="bg-indigo-600" 
                  subValue="A ser dividido estritamente"
                  subColor="text-indigo-700"
                />
              </div>

              {/* PARTNER DIVISION MATRIX */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* DIVISION GRAPH CARD */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="font-black text-slate-800 text-sm uppercase">Divisão de Lucros dos Sócios</h3>
                      <p className="text-xs text-slate-400">Formula: Faturamento - (Despesas + Frota + Comissões + Vales)</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">Fórmula Estrita</span>
                  </div>

                  <div className="space-y-4">
                    {partners.map(partner => {
                      const shareAmount = (netProfit * partner.sharePercentage) / 100;
                      return (
                        <div key={partner.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700">{partner.name}</span>
                            <span className="font-black text-indigo-700">R$ {shareAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Porcentagem acordada</span>
                              <span>{partner.sharePercentage.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${partner.sharePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* QUICK PWA / MOBILE ACCESSIBILITY CARD */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-xl text-white flex flex-col justify-between shadow-md relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8">
                    <Smartphone size={160} />
                  </div>
                  
                  <div className="space-y-3">
                    <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-500/20 w-fit block">PWA Mobile Ativo</span>
                    <h3 className="text-lg font-black leading-tight">Uso por Vendedores e Entregadores</h3>
                    <p className="text-xs text-slate-400">Layout mobile otimizado para celulares dos motoristas registrarem rotas em tempo real com GPS simulado.</p>
                  </div>

                  <div className="pt-6 space-y-4">
                    <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-lg flex items-center justify-between text-xs text-slate-300">
                      <span>Entregadores Ativos Online</span>
                      <span className="font-bold text-emerald-400">{activeDeliveriesCount} de 5</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('order_flow')}
                      className="w-full bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-indigo-600 transition-all flex items-center justify-center gap-1 shadow"
                    >
                      Iniciar Novo Pedido <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

              </div>

              {/* RECENT SALES TRACKER AND MAP PREVIEW */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="font-black text-slate-800 text-sm uppercase">Histórico de Pedidos Recentes</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowDeletedSales(!showDeletedSales)}
                      className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showDeletedSales ? "Ocultar Cancelados/Excluídos" : "Ver Cancelados/Excluídos"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="p-3">Data / Hora</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Produto</th>
                        <th className="p-3">Quantidade</th>
                        <th className="p-3">Preço Unitário</th>
                        <th className="p-3">Taxa de Entrega</th>
                        <th className="p-3">Total Bruto</th>
                        <th className="p-3">Comissão</th>
                        <th className="p-3">Lucro da Venda</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sales
                        .filter(s => showDeletedSales ? true : !s.deletedAt)
                        .slice()
                        .reverse()
                        .map(sale => {
                          const client = clients.find(c => c.id === sale.clientId);
                          const product = products.find(p => p.id === sale.productId);
                          const delivery = deliveryPersons.find(d => d.id === sale.deliveryPersonId);
                          const isDeleted = !!sale.deletedAt;
                          
                          return (
                            <tr key={sale.id} className={`hover:bg-slate-50/50 transition-colors ${isDeleted ? 'bg-red-50/40 opacity-75 line-through' : ''}`}>
                              <td className="p-3">
                                <p className="font-bold text-slate-700">{new Date(sale.date).toLocaleDateString('pt-BR')}</p>
                                <p className="text-[10px] text-slate-400">{new Date(sale.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                              </td>
                              <td className="p-3">
                                <p className="font-bold text-slate-800">{client?.name || 'Venda Direta'}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{client?.address || 'Sem frete'}</p>
                              </td>
                              <td className="p-3 font-semibold text-slate-700">{product?.name || '---'}</td>
                              <td className="p-3 font-bold text-slate-800">{sale.quantity} un</td>
                              <td className="p-3 font-semibold text-slate-700">R$ {sale.unitPrice.toFixed(2)}</td>
                              <td className="p-3 font-semibold text-slate-600">R$ {sale.deliveryFee.toFixed(2)}</td>
                              <td className="p-3 font-black text-slate-800">R$ {sale.totalAmount.toFixed(2)}</td>
                              <td className="p-3">
                                {sale.commission > 0 ? (
                                  <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                    R$ {sale.commission.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                              <td className="p-3 font-black text-indigo-700">R$ {sale.profit.toFixed(2)}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  sale.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                  sale.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {sale.status === 'delivered' ? 'Entregue' : sale.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button 
                                  onClick={() => setSelectedSaleForReceipt(sale)}
                                  className="text-slate-400 hover:text-indigo-600 transition-all"
                                  title="Recibo em Imagem"
                                >
                                  <ImageIcon size={14} />
                                </button>
                                {!isDeleted && (
                                  <button 
                                    onClick={() => deleteSale(sale.id)}
                                    className="text-slate-400 hover:text-red-500 transition-all"
                                    title="Cancelar/Excluir"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      {sales.length === 0 && (
                        <tr>
                          <td colSpan={11} className="p-8 text-center text-slate-400 italic">Nenhum pedido registrado ainda.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: FLOW DE NOVO PEDIDO (WORKFLOW COMPLETO) */}
          {activeTab === 'order_flow' && (
            <motion.div 
              key="order_flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Lançar Novo Pedido de Água</h2>
                <p className="text-sm text-slate-500">Tela rápida inteligente com cálculo de custos, preços dinâmicos e disparo de comissão.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CONFIGURATION PANEL */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">Filtros & Seleções do Pedido</h3>
                  
                  {/* STEP 1: CLIENT AUTOCOMPLETE / DROPDOWN */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">1. Selecionar Cliente</label>
                    <select 
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 bg-white"
                      value={newSale.clientId || ''}
                      onChange={e => {
                        const targetId = e.target.value;
                        const client = clients.find(c => c.id === targetId);
                        if (client) {
                          const sector = sectors.find(s => s.id === client.sectorId);
                          setNewSale(prev => ({
                            ...prev,
                            clientId: targetId,
                            deliveryFee: sector ? sector.deliveryFee : 0
                          }));
                        } else {
                          setNewSale(prev => ({ ...prev, clientId: '', deliveryFee: 0 }));
                        }
                      }}
                    >
                      <option value="">-- Escolha um Cliente --</option>
                      {clients.filter(c => !c.deletedAt).map(c => {
                        const sector = sectors.find(s => s.id === c.sectorId);
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name} - {c.address} ({sector?.name || 'Sem Setor'})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* PRICE VARIATION MATRIX */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">2. Atacado ou Varejo</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewSale(p => ({ ...p, atacadoVarejo: 'varejo' }))}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${newSale.atacadoVarejo === 'varejo' ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                        >
                          Varejo
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewSale(p => ({ ...p, atacadoVarejo: 'atacado' }))}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${newSale.atacadoVarejo === 'atacado' ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                        >
                          Atacado
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">3. Forma de Pagamento</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewSale(p => ({ ...p, vistaPrazo: 'vista' }))}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${newSale.vistaPrazo === 'vista' ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                        >
                          À Vista
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewSale(p => ({ ...p, vistaPrazo: 'prazo' }))}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${newSale.vistaPrazo === 'prazo' ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'}`}
                        >
                          A Prazo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SELECT PRODUCT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">4. Escolher Água</label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 bg-white"
                        value={newSale.productId || ''}
                        onChange={e => {
                          const prodId = e.target.value;
                          setNewSale(p => ({ ...p, productId: prodId }));
                        }}
                      >
                        <option value="">-- Escolha a Embalagem --</option>
                        {products.filter(p => !p.deletedAt).map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">5. Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-800"
                        value={newSale.quantity}
                        onChange={e => setNewSale(p => ({ ...p, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                      />
                    </div>
                  </div>

                  {/* CHOOSE DELIVERER */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">6. Vincular Entregador</label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 bg-white"
                      value={newSale.deliveryPersonId || ''}
                      onChange={e => setNewSale(p => ({ ...p, deliveryPersonId: e.target.value }))}
                    >
                      <option value="">-- Escolha o Entregador para Comissionar --</option>
                      {deliveryPersons.filter(dp => !dp.deletedAt && dp.status === 'active').map(dp => (
                        <option key={dp.id} value={dp.id}>
                          {dp.name} (Entregador #{dp.number})
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* COMPUTED REAL-TIME CALCULATOR PANEL */}
                {(() => {
                  const client = clients.find(c => c.id === newSale.clientId);
                  const product = products.find(p => p.id === newSale.productId);
                  const deliveryPerson = deliveryPersons.find(dp => dp.id === newSale.deliveryPersonId);
                  
                  // Price type identifier
                  const priceType = `${newSale.atacadoVarejo}_${newSale.vistaPrazo}` as Sale['priceType'];
                  
                  let unitPrice = 0;
                  if (product) {
                    if (priceType === 'varejo_vista') unitPrice = product.priceVarejoVista;
                    else if (priceType === 'varejo_prazo') unitPrice = product.priceVarejoPrazo;
                    else if (priceType === 'atacado_vista') unitPrice = product.priceAtacadoVista;
                    else if (priceType === 'atacado_prazo') unitPrice = product.priceAtacadoPrazo;
                  }

                  const unitCost = product ? product.unitCost : 0;
                  const deliveryFee = newSale.deliveryFee;
                  const totalProducts = unitPrice * newSale.quantity;
                  const totalAmount = totalProducts + deliveryFee;
                  const totalCost = unitCost * newSale.quantity;
                  
                  // COMMISSION TRIGGER RULE: R$1 commission for Galão 20L if price > 10.00
                  let potentialCommission = 0;
                  const isGalao = product?.id === 'prod-7';
                  const triggerActive = isGalao && unitPrice > 10.00;
                  if (triggerActive && deliveryPerson) {
                    potentialCommission = newSale.quantity * 1.00;
                  }

                  const profit = totalAmount - totalCost;

                  // WHATSAPP REVENUE MESSAGE GENERATOR
                  const generateWhatsAppLink = () => {
                    if (!client) return '';
                    const cleanPhone = client.phone.replace(/\D/g, '');
                    const message = `*RECIBO DE VENDA - AQUA FLOW* 💧\n\n` +
                      `Olá, *${client.name}*!\n` +
                      `Seu pedido foi registrado com sucesso e já está a caminho!\n\n` +
                      `*Detalhamento do Pedido:*\n` +
                      `▪ Embalagem: _${product?.name || 'Água Mineral'}_\n` +
                      `▪ Quantidade: ${newSale.quantity} unidades\n` +
                      `▪ Tipo: ${newSale.atacadoVarejo.toUpperCase()} (${newSale.vistaPrazo.toUpperCase()})\n` +
                      `▪ Preço Unitário: R$ ${unitPrice.toFixed(2)}\n` +
                      `▪ Taxa de Frete: R$ ${deliveryFee.toFixed(2)}\n\n` +
                      `*Valor Total: R$ ${totalAmount.toFixed(2)}*\n\n` +
                      `*Endereço de Entrega:*\n` +
                      `📍 ${client.address}\n\n` +
                      `Responsável pela entrega: _${deliveryPerson?.name || 'Equipe Interna'}_.\n\n` +
                      `Agradecemos sua preferência! 🥤`;
                    
                    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
                  };

                  const handleRegisterSale = () => {
                    if (!newSale.clientId || !newSale.productId || !newSale.deliveryPersonId) {
                      alert("Por favor, preencha o Cliente, o Produto e o Entregador.");
                      return;
                    }

                    addSale({
                      clientId: newSale.clientId,
                      deliveryPersonId: newSale.deliveryPersonId,
                      productId: newSale.productId,
                      quantity: newSale.quantity,
                      priceType,
                      unitPrice,
                      unitCost,
                      deliveryFee,
                      totalAmount,
                      totalCost,
                      profit,
                      date: new Date().toISOString(),
                      status: 'pending'
                    });

                    alert("Pedido lançado com sucesso!");
                    setNewSale(p => ({ ...p, clientId: '', productId: '' }));
                  };

                  return (
                    <div className="space-y-6">
                      
                      {/* COMPUTED METRICS CARD */}
                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">Resumo da Cobrança</h3>
                        
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Produtos (R$ {unitPrice.toFixed(2)} x {newSale.quantity})</span>
                            <span className="font-bold text-slate-800">R$ {totalProducts.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Taxa de Frete</span>
                            <span className="font-bold text-indigo-600">+ R$ {deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-100 text-base">
                            <span className="font-black text-slate-800">Total a Pagar</span>
                            <span className="font-black text-indigo-900 text-lg">R$ {totalAmount.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* COMMISSION INDICATOR CARD */}
                        {potentialCommission > 0 ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                            <div>
                              <p className="font-bold">Regra de Comissão Ativa: +R$ 1,00/galão</p>
                              <p className="opacity-90">R$ {potentialCommission.toFixed(2)} serão somados ao card de {deliveryPerson?.name}.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-400">
                            Preço abaixo de R$10.00 ou produto diferente de Galão de 20L não geram comissão automática neste pedido.
                          </div>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button
                          type="button"
                          onClick={handleRegisterSale}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                        >
                          <ShoppingCart size={18} /> Registrar Pedido no Supabase
                        </button>
                      </div>

                      {/* WHATSAPP ACTION CARD */}
                      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500 text-white p-1 rounded-md">
                            <Send size={16} />
                          </span>
                          <h4 className="font-bold text-slate-800 text-xs uppercase">Enviar Orçamento Cliente</h4>
                        </div>
                        <p className="text-xs text-slate-500">Cria o link oficial wa.me formatado com o orçamento, endereço e taxa.</p>
                        
                        {client ? (
                          <a
                            href={generateWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all block text-center"
                          >
                            <Send size={14} /> Abrir Conversa no WhatsApp
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            Selecione o Cliente Primeiro
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })()}

              </div>
            </motion.div>
          )}

          {/* TAB 3: CLIENTES & SETORES DE ENTREGA */}
          {activeTab === 'clients' && (
            <motion.div 
              key="clients"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cadastro de Clientes & Setores</h2>
                  <p className="text-sm text-slate-500">Gestão integrada de fretes automáticos por região da cidade.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowDeletedClients(!showDeletedClients)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-all"
                  >
                    {showDeletedClients ? "Ocultar Excluídos" : "Ver Excluídos (Soft Delete)"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LIST OF CLIENTS */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                    <Search size={16} className="text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Pesquisar cliente por nome ou endereço..."
                      className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
                      onChange={e => {
                        const val = e.target.value.toLowerCase();
                        // Filter logic can be triggered instantly
                      }}
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                          <th className="p-3">Nome do Cliente</th>
                          <th className="p-3">Endereço Completo</th>
                          <th className="p-3">Setor / Cidade</th>
                          <th className="p-3">Telefone</th>
                          <th className="p-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {clients
                          .filter(c => showDeletedClients ? true : !c.deletedAt)
                          .map(client => {
                            const sector = sectors.find(s => s.id === client.sectorId);
                            const isDeleted = !!client.deletedAt;

                            return (
                              <tr key={client.id} className={`hover:bg-slate-50/50 transition-colors ${isDeleted ? 'bg-red-50/50 opacity-75 line-through' : ''}`}>
                                <td className="p-3 font-bold text-slate-800 uppercase">{client.name}</td>
                                <td className="p-3 font-medium text-slate-600">{client.address}</td>
                                <td className="p-3">
                                  {sector ? (
                                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                      {sector.name} (+R$ {sector.deliveryFee.toFixed(2)})
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 italic">Sem setor</span>
                                  )}
                                </td>
                                <td className="p-3 font-semibold text-slate-700">{client.phone}</td>
                                <td className="p-3 text-right">
                                  {!isDeleted && (
                                    <button 
                                      onClick={() => deleteClient(client.id)}
                                      className="text-slate-400 hover:text-red-500 transition-colors"
                                      title="Soft Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        {clients.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 italic">Nenhum cliente cadastrado no momento.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ADD CLIENT FORM AND SECTOR INFO */}
                <div className="space-y-6">
                  
                  {/* ADD CLIENT CARD */}
                  <form 
                    onSubmit={e => {
                      e.preventDefault();
                      const target = e.target as any;
                      const name = target.elements.name.value;
                      const phone = target.elements.phone.value;
                      const address = target.elements.address.value;
                      const sectorId = target.elements.sectorId.value;

                      if (!name || !address || !sectorId) {
                        alert("Preencha todos os campos obrigatórios.");
                        return;
                      }

                      addClient({ name, phone, address, sectorId });
                      target.reset();
                      alert("Cliente cadastrado com sucesso!");
                    }}
                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4"
                  >
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100">Cadastrar Cliente</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nome Completo *</label>
                      <input 
                        name="name"
                        type="text" 
                        required
                        placeholder="Ex: Mercantil Souza"
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Telefone/WhatsApp</label>
                      <input 
                        name="phone"
                        type="text" 
                        placeholder="Ex: 22999998888"
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Endereço Completo *</label>
                      <input 
                        name="address"
                        type="text" 
                        required
                        placeholder="Ex: Av Amaral Peixoto, 120"
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Região / Setor *</label>
                      <select 
                        name="sectorId"
                        required
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      >
                        <option value="">Selecione a Região...</option>
                        {sectors.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - R$ {s.deliveryFee.toFixed(2)}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-all shadow-sm"
                    >
                      Salvar Cadastro
                    </button>
                  </form>

                  {/* ACTIVE SECTORS SUMMARY CARD */}
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs uppercase">Setores Cadastrados</h4>
                    <div className="space-y-2">
                      {sectors.map(s => (
                        <div key={s.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <p className="font-bold text-slate-700 leading-none">{s.name}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{s.city}</p>
                          </div>
                          <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            R$ {s.deliveryFee.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: CATALOGO DE PRODUTOS E PRECOS */}
          {activeTab === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Catálogo de Águas e Preços Dinâmicos</h2>
                  <p className="text-sm text-slate-500">Tabela unificada com as 4 variações de preços necessárias para faturamento.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setSelectedProductForModal(null);
                      setProductModalOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus size={14} /> Novo Produto
                  </button>
                  <button 
                    onClick={() => setShowDeletedProducts(!showDeletedProducts)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-all"
                  >
                    {showDeletedProducts ? "Ocultar Excluídos" : "Ver Excluídos"}
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="p-3">Embalagem de Água</th>
                        <th className="p-3 text-right">Custo Unitário</th>
                        <th className="p-3 text-right bg-emerald-50 text-emerald-800 font-bold">Varejo à Vista</th>
                        <th className="p-3 text-right bg-emerald-50 text-emerald-800 font-bold">Varejo a Prazo</th>
                        <th className="p-3 text-right bg-indigo-50 text-indigo-800 font-bold">Atacado à Vista</th>
                        <th className="p-3 text-right bg-indigo-50 text-indigo-800 font-bold">Atacado a Prazo</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products
                        .filter(p => showDeletedProducts ? true : !p.deletedAt)
                        .map(product => {
                          const isDeleted = !!product.deletedAt;

                          return (
                            <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${isDeleted ? 'bg-red-50/50 opacity-75 line-through' : ''}`}>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="bg-blue-100 text-blue-700 p-1 rounded-md">
                                    <Layers size={14} />
                                  </span>
                                  <div>
                                    <p className="font-bold text-slate-800 uppercase">{product.name}</p>
                                    <p className="text-[9px] text-slate-400">{isDeleted ? 'Excluído soft' : 'Ativo'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-right font-semibold text-slate-600">R$ {product.unitCost.toFixed(2)}</td>
                              <td className="p-3 text-right font-black text-emerald-700 bg-emerald-50/40">R$ {product.priceVarejoVista.toFixed(2)}</td>
                              <td className="p-3 text-right font-black text-emerald-700 bg-emerald-50/40">R$ {product.priceVarejoPrazo.toFixed(2)}</td>
                              <td className="p-3 text-right font-black text-indigo-700 bg-indigo-50/40">R$ {product.priceAtacadoVista.toFixed(2)}</td>
                              <td className="p-3 text-right font-black text-indigo-700 bg-indigo-50/40">R$ {product.priceAtacadoPrazo.toFixed(2)}</td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center items-center gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedProductForModal(product);
                                      setProductModalOpen(true);
                                    }}
                                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded hover:bg-slate-100 transition-colors"
                                    title="Editar Produto"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  {!isDeleted ? (
                                    <button 
                                      onClick={() => {
                                        if (confirm(`Tem certeza de que deseja desativar (soft delete) a embalagem "${product.name}"?`)) {
                                          deleteProduct(product.id);
                                          alert("Produto desativado!");
                                        }
                                      }}
                                      className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-slate-100 transition-colors"
                                      title="Desativar Produto"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-red-500 font-bold uppercase italic p-1">Excluído</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QUICK UPDATE VALUE DISCLOSURE */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <HelpCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-amber-800 space-y-1">
                  <p className="font-bold">Regra de Faturamento Dinâmico:</p>
                  <p className="opacity-90">O faturamento dinâmico do faturamento de pedidos busca esses valores cadastrados em tempo real. Sempre que registrar uma nova venda, a interface faz a precificação adequada para evitar erros manuais de faturamento por telefone.</p>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: LOGISTICA E ROTEAMENTO INTELIGENTE */}
          {activeTab === 'logistics' && (
            <motion.div 
              key="logistics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Roteamento Inteligente & Logística</h2>
                <p className="text-sm text-slate-500">Distribuição automatizada priorizando o horário de criação e agrupando rotas por setor geográfico.</p>
              </div>

              {/* ROUTING CARDS SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* PENDING OPERATIONS LIST */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm uppercase">Lista de Pedidos Pendentes para Entrega</h3>
                    <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">
                      Aguardando Saída
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sales
                      .filter(s => s.status === 'pending' && !s.deletedAt)
                      .map(sale => {
                        const client = clients.find(c => c.id === sale.clientId);
                        const product = products.find(p => p.id === sale.productId);
                        const sector = client ? sectors.find(sec => sec.id === client.sectorId) : null;
                        const deliverer = deliveryPersons.find(dp => dp.id === sale.deliveryPersonId);
                        
                        return (
                          <div key={sale.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-xs uppercase">{client?.name || 'Venda Avulsa'}</span>
                                <span className="bg-slate-200 text-slate-600 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">
                                  {sector?.name || 'A. CENTRO'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{client?.address}</p>
                              
                              <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1 font-semibold">
                                  <Clock size={12} /> {new Date(sale.date).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                                </span>
                                <span className="font-bold text-indigo-600">
                                  {product?.name} ({sale.quantity} un)
                                </span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-end gap-2 shrink-0">
                              <span className="text-xs font-black text-slate-800">Total: R$ {sale.totalAmount.toFixed(2)}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateSaleStatus(sale.id, 'delivered')}
                                  className="bg-indigo-600 text-white font-bold px-3 py-1 rounded text-[10px] hover:bg-indigo-700 transition-all shadow-sm"
                                >
                                  Confirmar Entrega
                                </button>
                                <button
                                  onClick={() => updateSaleStatus(sale.id, 'canceled')}
                                  className="bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded text-[10px] hover:bg-slate-300 transition-all"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {sales.filter(s => s.status === 'pending' && !s.deletedAt).length === 0 && (
                      <div className="p-8 text-center text-slate-400 italic">
                        Não existem pedidos pendentes. Toda a carga foi entregue!
                      </div>
                    )}
                  </div>
                </div>

                {/* INTELLIGENT AI SECTOR ROUTER PANEL */}
                <div className="space-y-6">
                  
                  {/* AI ROUTING ANALYSIS */}
                  <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-5 rounded-xl text-white shadow-md space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500 text-white p-1 rounded-md shrink-0">
                        <Activity size={16} />
                      </span>
                      <h4 className="font-bold text-xs uppercase tracking-wider">Sugestão de Rota Inteligente</h4>
                    </div>
                    
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      O cruzamento de rotas de entrega agrupa pedidos do mesmo setor para economizar combustível e otimizar tempo.
                    </p>

                    <div className="space-y-2 pt-2">
                      {sectors.map(sector => {
                        const pendingInSector = sales.filter(s => s.status === 'pending' && !s.deletedAt && clients.find(c => c.id === s.clientId)?.sectorId === sector.id).length;
                        if (pendingInSector === 0) return null;

                        return (
                          <div key={sector.id} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-200">{sector.name}</p>
                              <p className="text-[9px] text-slate-400">ETA Estimado: {pendingInSector * 15} mins</p>
                            </div>
                            <span className="bg-indigo-500/30 text-indigo-200 font-bold px-2 py-0.5 rounded text-[10px]">
                              {pendingInSector} Cargas
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE COURIER LOGISTICS STATUS */}
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs uppercase">Disponibilidade dos Entregadores</h4>
                    <div className="space-y-2">
                      {deliveryPersons.filter(dp => !dp.deletedAt).map(dp => (
                        <div key={dp.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <p className="font-bold text-slate-700">{dp.name}</p>
                            <p className="text-[9px] text-slate-400">Contato: {dp.phone || 'Sem celular'}</p>
                          </div>
                          <span className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase ${
                            dp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {dp.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 6: CARD DE VALES E COMISSOES (FECHAMENTO SEMANAL) */}
          {activeTab === 'vales_comissoes' && (
            <motion.div 
              key="vales_comissoes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Painel de Vales & Comissões (Parceiros da Água)</h2>
                  <p className="text-sm text-slate-500">Gestão financeira completa, incluindo adiantamentos (vales), consumo próprio, comissões acumuladas, débitos e fechamento semanal.</p>
                </div>
              </div>

              {/* COMPANY-WIDE FINANCIAL STATS BAR */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-slate-900 p-4 rounded-xl text-white shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Total Comissões</span>
                  <span className="text-sm font-black text-emerald-400">R$ {vouchers.filter(v => v.type === 'commission_earn' && !v.deletedAt).reduce((sum, v) => sum + v.amount, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Total Vales</span>
                  <span className="text-sm font-black text-rose-400">R$ {vouchers.filter(v => v.type === 'voucher_withdraw' && !v.deletedAt).reduce((sum, v) => sum + v.amount, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Total Consumo</span>
                  <span className="text-sm font-black text-amber-400">R$ {vouchers.filter(v => v.type === 'consumption_debit' && !v.deletedAt).reduce((sum, v) => sum + v.amount, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Total Débitos</span>
                  <span className="text-sm font-black text-purple-400">R$ {vouchers.filter(v => v.type === 'other_debit' && !v.deletedAt).reduce((sum, v) => sum + v.amount, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Acertos Pagos</span>
                  <span className="text-sm font-black text-blue-400">R$ {vouchers.filter(v => v.type === 'weekly_payment' && !v.deletedAt).reduce((sum, v) => sum + v.amount, 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-300 block uppercase font-bold tracking-wider">Pendente Geral</span>
                  <span className="text-sm font-black text-indigo-300">
                    R$ {deliveryPersons.filter(dp => !dp.deletedAt).reduce((sum, dp) => {
                      const cv = vouchers.filter(v => v.employeeId === dp.id && !v.deletedAt);
                      const e = cv.filter(v => v.type === 'commission_earn').reduce((acc, v) => acc + v.amount, 0);
                      const w = cv.filter(v => v.type === 'voucher_withdraw').reduce((acc, v) => acc + v.amount, 0);
                      const c = cv.filter(v => v.type === 'consumption_debit').reduce((acc, v) => acc + v.amount, 0);
                      const d = cv.filter(v => v.type === 'other_debit').reduce((acc, v) => acc + v.amount, 0);
                      const p = cv.filter(v => v.type === 'weekly_payment').reduce((acc, v) => acc + v.amount, 0);
                      return sum + (e - (w + c + d + p));
                    }, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* TEAM LIST AND COMMISSION LEDGERS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* DELIVERERS ACCOUNT LEDGERS */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm uppercase">Demonstrativo da Equipe</h3>
                    
                    {/* Filter Ledger Search & Type */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <input 
                        type="text"
                        placeholder="Buscar transação..."
                        value={ledgerSearch}
                        onChange={e => setLedgerSearch(e.target.value)}
                        className="p-1.5 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-40 font-medium"
                      />
                      <select
                        value={ledgerFilterType}
                        onChange={e => setLedgerFilterType(e.target.value)}
                        className="p-1.5 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      >
                        <option value="all">Todas</option>
                        <option value="commission_earn">Comissões</option>
                        <option value="voucher_withdraw">Vales</option>
                        <option value="consumption_debit">Consumo</option>
                        <option value="other_debit">Débitos</option>
                        <option value="weekly_payment">Acertos</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {deliveryPersons.filter(dp => !dp.deletedAt).map(dp => {
                      const courierVouchers = vouchers.filter(v => v.employeeId === dp.id && !v.deletedAt);
                      const earned = courierVouchers.filter(v => v.type === 'commission_earn').reduce((sum, v) => sum + v.amount, 0);
                      const withdrawn = courierVouchers.filter(v => v.type === 'voucher_withdraw').reduce((sum, v) => sum + v.amount, 0);
                      const consumption = courierVouchers.filter(v => v.type === 'consumption_debit').reduce((sum, v) => sum + v.amount, 0);
                      const debits = courierVouchers.filter(v => v.type === 'other_debit').reduce((sum, v) => sum + v.amount, 0);
                      const paid = courierVouchers.filter(v => v.type === 'weekly_payment').reduce((sum, v) => sum + v.amount, 0);
                      
                      const outstandingBalance = earned - (withdrawn + consumption + debits + paid);

                      const salary = dp.weeklySalary || 0;
                      const totalToReceive = salary + outstandingBalance;

                      // Filter the statements shown on this card
                      const filteredVouchers = courierVouchers.filter(v => {
                        const matchesType = ledgerFilterType === 'all' || v.type === ledgerFilterType;
                        const matchesSearch = v.description.toLowerCase().includes(ledgerSearch.toLowerCase());
                        return matchesType && matchesSearch;
                      });

                      return (
                        <div key={dp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4 shadow-sm hover:border-slate-300 transition-all">
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <h4 className="font-black text-slate-800 text-sm uppercase flex items-center gap-2">
                                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">Entregador #{dp.number}</span>
                                  {dp.name}
                                </h4>
                                <p className="text-xs text-slate-400">{dp.phone || 'Sem telefone cadastrado'}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditingEmployeeIdForCard(dp.id)}
                                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Editar Cadastro e Lançamentos"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                            
                            {/* Financial Summary Badges above the card */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Salário Semanal */}
                              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm text-right">
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Salário Semanal</p>
                                <p className="text-xs font-bold text-slate-750">R$ {salary.toFixed(2)}</p>
                              </div>

                              {/* Saldo Líquido */}
                              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm text-right">
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Saldo Líquido</p>
                                <p className={`text-xs font-bold ${outstandingBalance > 0 ? 'text-emerald-600' : outstandingBalance < 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                                  R$ {outstandingBalance.toFixed(2)}
                                </p>
                              </div>

                              {/* Valor a Receber */}
                              <div className="bg-indigo-55 px-3 py-1.5 rounded-lg border border-indigo-150/40 shadow-sm text-right">
                                <p className="text-[8px] text-indigo-500 font-bold uppercase tracking-wide">Valor a Receber</p>
                                <p className={`text-sm font-black ${totalToReceive >= 0 ? 'text-indigo-750' : 'text-rose-600'}`}>
                                  R$ {totalToReceive.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 5-way Financial Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-100">
                            <div className="border-r border-slate-100 pr-1">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase">Comissões (+)</span>
                              <span className="font-bold text-emerald-600">R$ {earned.toFixed(2)}</span>
                            </div>
                            <div className="border-r border-slate-100 pr-1">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase font-medium">Vales (-)</span>
                              <span className="font-bold text-rose-500">R$ {withdrawn.toFixed(2)}</span>
                            </div>
                            <div className="border-r border-slate-100 pr-1">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase font-medium">Consumo (-)</span>
                              <span className="font-bold text-amber-500">R$ {consumption.toFixed(2)}</span>
                            </div>
                            <div className="border-r border-slate-100 pr-1">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase font-medium">Débitos (-)</span>
                              <span className="font-bold text-purple-500">R$ {debits.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold uppercase font-medium">Acertos (-)</span>
                              <span className="font-bold text-blue-500">R$ {paid.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Extrato Recente / Filtrado */}
                          <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-150/60">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100 flex justify-between items-center">
                              <span>Histórico de Transações</span>
                              <span className="text-[8px] text-slate-400 font-normal">Mostrando {filteredVouchers.length} lançamentos</span>
                            </p>
                            
                            <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                              {filteredVouchers.length === 0 ? (
                                <p className="text-[10px] text-slate-400 text-center py-2 italic">Nenhuma transação encontrada para este filtro.</p>
                              ) : (
                                filteredVouchers.map(v => (
                                  <div key={v.id} className="flex justify-between items-center text-[11px] py-1 px-1.5 rounded hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        v.type === 'commission_earn' ? 'bg-emerald-500' :
                                        v.type === 'voucher_withdraw' ? 'bg-rose-500' :
                                        v.type === 'consumption_debit' ? 'bg-amber-500' :
                                        v.type === 'other_debit' ? 'bg-purple-500' :
                                        'bg-blue-500'
                                      }`} />
                                      <span className="text-slate-400 text-[9px] shrink-0">{new Date(v.date).toLocaleDateString('pt-BR')}</span>
                                      <span className="text-slate-600 truncate font-medium text-left">{v.description}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pl-2 shrink-0">
                                      <span className={`font-bold ${v.type === 'commission_earn' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {v.type === 'commission_earn' ? '+' : '-'} R$ {v.amount.toFixed(2)}
                                      </span>
                                      <button 
                                        onClick={() => {
                                          if (confirm(`Tem certeza de que deseja deletar este lançamento de R$ ${v.amount.toFixed(2)}?`)) {
                                            deleteVoucher(v.id);
                                            alert("Lançamento removido com sucesso!");
                                          }
                                        }}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-0.5 rounded hover:bg-slate-100"
                                        title="Deletar Lançamento"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Card Actions Footer */}
                          <div className="flex flex-wrap gap-2 justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingEmployeeIdForCard(dp.id)}
                              className="bg-indigo-50 text-indigo-700 border border-indigo-200/50 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase hover:bg-indigo-100 transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <Edit size={12} /> Editar Card / Lançamentos
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedEmployeeForReport(dp.id)}
                              className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <Activity size={12} /> Visualizar Holerite / Imprimir
                            </button>

                            <button
                              type="button"
                              onClick={() => handleWeeklyPaymentAndResetInDashboard(dp.id)}
                              className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-sm"
                            >
                              <Check size={12} /> Semana Paga (Zerar Tudo)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ADD VALE / MOVEMENT FORM */}
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    const target = e.target as any;
                    const employeeId = target.elements.employeeId.value;
                    const type = target.elements.type.value as any;
                    const amount = parseFloat(target.elements.amount.value);
                    const description = target.elements.description.value;
                    const customDate = target.elements.customDate.value;

                    if (!employeeId || !type || isNaN(amount) || amount <= 0 || !description) {
                      alert("Preencha todos os campos obrigatórios.");
                      return;
                    }

                    addVoucher({
                      employeeId,
                      type,
                      amount,
                      date: customDate ? new Date(customDate + 'T12:00:00').toISOString() : new Date().toISOString(),
                      description
                    });

                    target.reset();
                    alert("Movimentação financeira registrada com total precisão!");
                  }}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 h-fit"
                >
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100">Lançar Movimentação</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">1. Colaborador</label>
                    <select 
                      name="employeeId"
                      required
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="">Selecione...</option>
                      {deliveryPersons.filter(dp => !dp.deletedAt).map(dp => (
                        <option key={dp.id} value={dp.id}>{dp.name} (Entregador #{dp.number})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">2. Tipo de Movimentação</label>
                    <select 
                      name="type"
                      required
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="voucher_withdraw">Vale / Adiantamento (-)</option>
                      <option value="consumption_debit">Consumo Próprio de Água (-)</option>
                      <option value="commission_earn">Comissão Extra / Bônus (+)</option>
                      <option value="other_debit">Outros Débitos / Descontos (-)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">3. Valor (R$)</label>
                    <input 
                      name="amount"
                      type="number" 
                      step="0.01"
                      required
                      placeholder="Ex: 50.00"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">4. Descrição do Lançamento</label>
                    <input 
                      name="description"
                      type="text" 
                      required
                      placeholder="Ex: Pegou 2 Galões de 20L, Vale Quarta, etc."
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">5. Data Opcional (Padrão: Hoje)</label>
                    <input 
                      name="customDate"
                      type="date"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-all shadow-sm"
                  >
                    Registrar Lançamento
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* TAB 7: GESTÃO DE FROTA E CUSTOS DE COMBUSTÍVEL */}
          {activeTab === 'fleet' && (
            <motion.div 
              key="fleet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Frota & Custos de Transporte</h2>
                  <p className="text-sm text-slate-500">Monitoramento de placas, consumo de combustível e custos com manutenção de veículos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LIST OF VEHICLES */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 space-y-5">
                  <h3 className="font-bold text-slate-800 text-sm uppercase">Frota Ativa</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.filter(v => !v.deletedAt).map(v => {
                      const fleetCosts = fleetExpenses.filter(fe => fe.vehicleId === v.id && !fe.deletedAt);
                      const totalCosts = fleetCosts.reduce((sum, fe) => sum + fe.amount, 0);

                      return (
                        <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="bg-slate-800 text-white px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider">
                              {v.plate}
                            </span>
                            <span className="text-slate-400 capitalize text-[10px] font-bold">
                              {v.type === 'motorcycle' ? 'Moto' : v.type === 'car' ? 'Utilitário' : 'Caminhão'}
                            </span>
                          </div>

                          <div>
                            <p className="font-bold text-slate-800 text-xs">{v.model}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Operações registradas</p>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                            <span className="text-slate-500">Custos acumulados</span>
                            <span className="font-black text-rose-600">R$ {totalCosts.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* RECENT COSTS REGISTERED */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs uppercase">Gastos Recentes da Frota</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                            <th className="p-2">Veículo</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Descrição</th>
                            <th className="p-2">Data</th>
                            <th className="p-2 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {fleetExpenses.filter(fe => !fe.deletedAt).slice(-4).map(fe => {
                            const vehicle = vehicles.find(v => v.id === fe.vehicleId);
                            return (
                              <tr key={fe.id}>
                                <td className="p-2 font-mono font-bold text-slate-700">{vehicle?.plate || '---'}</td>
                                <td className="p-2 capitalize text-slate-600">
                                  {fe.type === 'fuel' ? 'Combustível' : fe.type === 'maintenance' ? 'Manutenção' : 'Outros'}
                                </td>
                                <td className="p-2 text-slate-500">{fe.description}</td>
                                <td className="p-2 text-slate-400">{new Date(fe.date).toLocaleDateString('pt-BR')}</td>
                                <td className="p-2 text-right font-black text-slate-800">R$ {fe.amount.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* ADD FLEET COST FORM */}
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    const target = e.target as any;
                    const vehicleId = target.elements.vehicleId.value;
                    const type = target.elements.type.value;
                    const amount = parseFloat(target.elements.amount.value);
                    const description = target.elements.description.value;

                    if (!vehicleId || !type || isNaN(amount) || amount <= 0 || !description) {
                      alert("Preencha todos os campos obrigatórios.");
                      return;
                    }

                    addFleetExpense({
                      vehicleId,
                      type,
                      amount,
                      date: new Date().toISOString(),
                      description
                    });

                    target.reset();
                    alert("Custo de frota registrado com sucesso!");
                  }}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 h-fit"
                >
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100">Lançar Custo de Veículo</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Selecione o Veículo</label>
                    <select 
                      name="vehicleId"
                      required
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="">Selecione...</option>
                      {vehicles.filter(v => !v.deletedAt).map(v => (
                        <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de Custo</label>
                    <select 
                      name="type"
                      required
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="fuel">Abastecimento (Combustível)</option>
                      <option value="maintenance">Manutenção Mecânica</option>
                      <option value="other">Outros / Licenciamento</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Valor Pago (R$)</label>
                    <input 
                      name="amount"
                      type="number" 
                      step="0.01"
                      required
                      placeholder="Ex: 150.00"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Descrição Completa</label>
                    <input 
                      name="description"
                      type="text" 
                      required
                      placeholder="Ex: Gasolina aditivada motorista Carlos"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-all shadow-sm"
                  >
                    Registrar Despesa de Frota
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* TAB 8: EXPORT SUPABASE SCRIPT & NEXTJS SETUP */}
          {activeTab === 'supabase_setup' && (
            <motion.div 
              key="supabase_setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Script SQL Supabase & Next.js Blueprint</h2>
                <p className="text-sm text-slate-500">Desenvolva o seu backend no Supabase e clone os arquivos necessários no Next.js.</p>
              </div>

              {/* ACTION: COPY SCRIPT CARD */}
              <div className="bg-slate-900 text-slate-300 p-6 rounded-xl shadow-lg font-mono text-xs space-y-4 relative overflow-hidden border border-slate-800">
                <div className="absolute right-4 top-4">
                  <button 
                    onClick={() => {
                      const sqlText = document.getElementById('supabase_sql_code')?.innerText || '';
                      navigator.clipboard.writeText(sqlText);
                      alert("Script SQL copiado com sucesso!");
                    }}
                    className="bg-slate-800 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md font-sans text-[11px] font-bold transition-all flex items-center gap-1.5 shadow"
                  >
                    <Copy size={12} /> Copiar SQL Completo
                  </button>
                </div>

                <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-800 pb-3 mb-3 font-sans text-xs">
                  <Code size={16} /> DDL COMPLETO SUPABASE (POSTGRESQL & TRIGGERS)
                </div>

                <div id="supabase_sql_code" className="overflow-y-auto max-h-[350px] space-y-1 select-all pr-4 scrollbar-thin">
                  <p className="text-slate-500">-- 1. EXTENSIONS FOR SECURE IDENTIFIERS</p>
                  <p>CREATE EXTENSION IF NOT EXISTS "uuid-ossp";</p>
                  <p className="text-slate-500">-- 2. CREATE MASTER TABLES WITH SOFT DELETE SUPPORT</p>
                  <p>CREATE TABLE public.usuarios (</p>
                  <p>&nbsp;&nbsp;id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;nome text NOT NULL,</p>
                  <p>&nbsp;&nbsp;role text NOT NULL CHECK (role IN ('socio', 'vendedor', 'entregador')),</p>
                  <p>&nbsp;&nbsp;status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.setores (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;nome text NOT NULL,</p>
                  <p>&nbsp;&nbsp;cidade text NOT NULL,</p>
                  <p>&nbsp;&nbsp;taxa_entrega numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.clientes (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;nome text NOT NULL,</p>
                  <p>&nbsp;&nbsp;telefone text,</p>
                  <p>&nbsp;&nbsp;endereco text NOT NULL,</p>
                  <p>&nbsp;&nbsp;setor_id uuid REFERENCES public.setores(id) ON DELETE SET NULL,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.produtos (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;nome text NOT NULL,</p>
                  <p>&nbsp;&nbsp;custo_unitario numeric(10,4) NOT NULL DEFAULT 0.0000,</p>
                  <p>&nbsp;&nbsp;custo_fardo numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;quantidade_fardo integer NOT NULL DEFAULT 12,</p>
                  <p>&nbsp;&nbsp;preco_varejo_vista numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;preco_varejo_prazo numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;preco_atacado_vista numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;preco_atacado_prazo numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <p>COMMENT ON COLUMN public.produtos.custo_fardo IS 'Custo total de aquisição do fardo fechado';</p>
                  <p>COMMENT ON COLUMN public.produtos.quantidade_fardo IS 'Quantidade de garrafas/unidades no fardo';</p>
                  <br/>
                  <p>CREATE TABLE public.veiculos (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;placa text NOT NULL UNIQUE,</p>
                  <p>&nbsp;&nbsp;tipo text NOT NULL CHECK (tipo IN ('caminhao', 'carro', 'moto')),</p>
                  <p>&nbsp;&nbsp;modelo text NOT NULL,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.gastos_frota (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;veiculo_id uuid REFERENCES public.veiculos(id) ON DELETE CASCADE NOT NULL,</p>
                  <p>&nbsp;&nbsp;tipo text NOT NULL CHECK (tipo IN ('combustivel', 'manutencao', 'outros')),</p>
                  <p>&nbsp;&nbsp;valor numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;data timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;descricao text NOT NULL,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.despesas (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;descricao text NOT NULL,</p>
                  <p>&nbsp;&nbsp;valor numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;data timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;categoria text NOT NULL,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.pedidos (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;cliente_id uuid REFERENCES public.clientes(id) ON DELETE RESTRICT NOT NULL,</p>
                  <p>&nbsp;&nbsp;entregador_id uuid REFERENCES public.usuarios(id) ON DELETE RESTRICT,</p>
                  <p>&nbsp;&nbsp;vendedor_id uuid REFERENCES public.usuarios(id) ON DELETE RESTRICT,</p>
                  <p>&nbsp;&nbsp;produto_id uuid REFERENCES public.produtos(id) ON DELETE RESTRICT NOT NULL,</p>
                  <p>&nbsp;&nbsp;quantidade integer NOT NULL CHECK (quantidade &gt; 0),</p>
                  <p>&nbsp;&nbsp;tipo_preco text NOT NULL CHECK (tipo_preco IN ('varejo_vista', 'varejo_prazo', 'atacado_vista', 'atacado_prazo')),</p>
                  <p>&nbsp;&nbsp;preco_unitario numeric(10,2) NOT NULL,</p>
                  <p>&nbsp;&nbsp;custo_unitario numeric(10,2) NOT NULL,</p>
                  <p>&nbsp;&nbsp;taxa_entrega numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;valor_total numeric(10,2) NOT NULL,</p>
                  <p>&nbsp;&nbsp;custo_total numeric(10,2) NOT NULL,</p>
                  <p>&nbsp;&nbsp;comissao numeric(10,2) NOT NULL DEFAULT 0.00,</p>
                  <p>&nbsp;&nbsp;lucro numeric(10,2) NOT NULL,</p>
                  <p>&nbsp;&nbsp;status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'entregue', 'cancelado')),</p>
                  <p>&nbsp;&nbsp;data timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p>CREATE TABLE public.vales_comissoes (</p>
                  <p>&nbsp;&nbsp;id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;usuario_id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,</p>
                  <p>&nbsp;&nbsp;tipo text NOT NULL CHECK (tipo IN ('comissao', 'vale')),</p>
                  <p>&nbsp;&nbsp;valor numeric(10,2) NOT NULL,</p>
                  <p>&nbsp;&nbsp;data timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;descricao text NOT NULL,</p>
                  <p>&nbsp;&nbsp;created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,</p>
                  <p>&nbsp;&nbsp;deleted_at timestamp with time zone</p>
                  <p>);</p>
                  <br/>
                  <p className="text-slate-500">-- 3. COMMISSION ENGINE AUTOMATED TRIGGER (R$1.00 FOR 20L GALÃO ABOVE R$10.00)</p>
                  <p>CREATE OR REPLACE FUNCTION public.processar_comissao_galao()</p>
                  <p>RETURNS TRIGGER AS $$</p>
                  <p>DECLARE</p>
                  <p>&nbsp;&nbsp;v_id_galao_20l uuid;</p>
                  <p>BEGIN</p>
                  <p>&nbsp;&nbsp;SELECT id INTO v_id_galao_20l FROM public.produtos WHERE nome ILIKE '%20 Litros%' LIMIT 1;</p>
                  <p>&nbsp;&nbsp;IF (new.produto_id = v_id_galao_20l AND new.preco_unitario &gt; 10.00 AND new.entregador_id IS NOT NULL) THEN</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;new.comissao := new.quantidade * 1.00;</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;INSERT INTO public.vales_comissoes (usuario_id, tipo, valor, data, descricao)</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;VALUES (</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new.entregador_id,</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'comissao',</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new.quantidade * 1.00,</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;now(),</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Comissão automática - Pedido #' || substring(new.id::text from 1 for 8) || ' (' || new.quantidade || ' galões)'</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;);</p>
                  <p>&nbsp;&nbsp;ELSE</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;new.comissao := 0.00;</p>
                  <p>&nbsp;&nbsp;END IF;</p>
                  <p>&nbsp;&nbsp;RETURN new;</p>
                  <p>END;</p>
                  <p>$$ LANGUAGE plpgsql;</p>
                  <br/>
                  <p>CREATE TRIGGER tr_comissao_galao</p>
                  <p>BEFORE INSERT ON public.pedidos</p>
                  <p>FOR EACH ROW EXECUTE FUNCTION public.processar_comissao_galao();</p>
                  <br/>
                  <p className="text-slate-500">-- 4. ROW LEVEL SECURITY ACTIVATION</p>
                  <p>ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.gastos_frota ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;</p>
                  <p>ALTER TABLE public.vales_comissoes ENABLE ROW LEVEL SECURITY;</p>
                </div>
              </div>

              {/* RECOMMENDED DIRECTORY FOLDER STRUCTURE FOR NEXT.JS */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase">Estrutura Recomendada do Projeto Next.js</h3>
                <p className="text-xs text-slate-500">Diretórios limpos e separados por responsabilidades do App Router.</p>
                
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre scrollbar-thin">
{`my-distribution-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Layout global com os Provedores
│   │   ├── page.tsx               # Homepage / Login Redirect
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard com métricas de Sócios
│   │   ├── pedidos/
│   │   │   └── page.tsx           # Fluxo de novo pedido com WhatsApp
│   │   ├── clientes/
│   │   │   └── page.tsx           # Cadastro de clientes e busca
│   │   └── financeiro/
│   │       └── page.tsx           # Card de vales e despesas de frota
│   ├── components/
│   │   ├── sidebar.tsx            # Sidebar de navegação responsiva
│   │   ├── receipt-modal.tsx      # Modal para renderizar e baixar o comprovante
│   │   └── ui/                    # Componentes ShadcnUI (Button, Select, Card)
│   ├── lib/
│   │   └── supabaseClient.ts      # Inicialização do cliente Supabase para o Client Component
│   ├── types/
│   │   └── index.ts               # Tipos globais mapeando o Banco de Dados
│   └── middleware.ts              # Proteção de rotas com Supabase Auth
├── .env.local                     # Credenciais do Supabase (NEXT_PUBLIC_SUPABASE_URL)
└── package.json`}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* RENDER MODAL IF SELECTED */}
      <AnimatePresence>
        {selectedSaleForReceipt && (
          <Receipt 
            sale={selectedSaleForReceipt}
            client={clients.find(c => c.id === selectedSaleForReceipt.clientId)}
            delivery={deliveryPersons.find(d => d.id === selectedSaleForReceipt.deliveryPersonId)}
            product={products.find(p => p.id === selectedSaleForReceipt.productId)}
            onDownload={() => setSelectedSaleForReceipt(null)}
            onClose={() => setSelectedSaleForReceipt(null)}
          />
        )}
        {selectedEmployeeForReport && (
          <EmployeeReportModal 
            employeeId={selectedEmployeeForReport}
            onClose={() => setSelectedEmployeeForReport(null)}
          />
        )}
        {editingEmployeeIdForCard && (
          <EmployeeEditModal 
            employeeId={editingEmployeeIdForCard}
            onClose={() => setEditingEmployeeIdForCard(null)}
          />
        )}
        {productModalOpen && (
          <ProductModal 
            product={selectedProductForModal}
            onClose={() => {
              setProductModalOpen(false);
              setSelectedProductForModal(null);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// Global App Wrapper to bind AppProvider
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
