import { useState, useEffect } from 'react';
import styles from '../styleCss/home.module.css';

function HomePage() {
  // Sample resident data
  const initialResidents = [
    { id: 1, name: "أحمد محمد", apartment: "101", isPaid: true, amount: 150, date: "2023-07-15" },
    { id: 2, name: "سارة خالد", apartment: "102", isPaid: false, amount: 0, date: "" },
    { id: 3, name: "علي حسن", apartment: "201", isPaid: true, amount: 150, date: "2023-07-10" },
    { id: 4, name: "لمى عبد الله", apartment: "202", isPaid: true, amount: 150, date: "2023-07-12" },
    { id: 5, name: "يوسف إبراهيم", apartment: "301", isPaid: false, amount: 0, date: "" },
    { id: 6, name: "نورا فارس", apartment: "302", isPaid: true, amount: 150, date: "2023-07-14" },
    { id: 7, name: "فارس عدنان", apartment: "401", isPaid: false, amount: 0, date: "" },
    { id: 8, name: "هديل قاسم", apartment: "402", isPaid: true, amount: 150, date: "2023-07-08" },
  ];

  const [residents, setResidents] = useState(initialResidents);
  const [showForm, setShowForm] = useState(false);
  const [newResident, setNewResident] = useState({
    name: "",
    apartment: "",
    isPaid: false,
    amount: 0,
    date: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Calculate statistics
  const totalResidents = residents.length;
  const paidResidents = residents.filter(r => r.isPaid).length;
  const unpaidResidents = totalResidents - paidResidents;
  const totalAmount = residents.reduce((sum, resident) => sum + resident.amount, 0);
  const expectedAmount = totalResidents * 150; // Assuming 150 JOD per resident

  // Filter residents based on search and status
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resident.apartment.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "paid" && resident.isPaid) || 
                         (filterStatus === "unpaid" && !resident.isPaid);
    
    return matchesSearch && matchesStatus;
  });

  // Handle payment status change
  const handlePaymentChange = (id, isPaid) => {
    const updatedResidents = residents.map(resident => {
      if (resident.id === id) {
        return { 
          ...resident, 
          isPaid,
          amount: isPaid ? 150 : 0,
          date: isPaid ? new Date().toISOString().split('T')[0] : ""
        };
      }
      return resident;
    });
    setResidents(updatedResidents);
  };

  // Handle adding a new resident
  const handleAddResident = (e) => {
    e.preventDefault();
    const residentToAdd = {
      ...newResident,
      id: residents.length + 1,
      amount: newResident.isPaid ? 150 : 0,
      date: newResident.isPaid ? new Date().toISOString().split('T')[0] : ""
    };
    
    setResidents([...residents, residentToAdd]);
    setNewResident({ name: "", apartment: "", isPaid: false, amount: 0, date: "" });
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>نظام متابعة مدفوعات العمارة</h1>
        <p>تتبع مدفوعات السكان بسهولة و كفاءة</p>
      </header>

      <div className={styles.dashboard}>
        <div className={`${styles.card} ${styles.total}`}>
          <h2>إجمالي السكان</h2>
          <p>{totalResidents}</p>
        </div>
        
        <div className={`${styles.card} ${styles.paid}`}>
          <h2>الذين دفعوا</h2>
          <p>{paidResidents}</p>
        </div>
        
        <div className={`${styles.card} ${styles.unpaid}`}>
          <h2>الذين لم يدفعوا</h2>
          <p>{unpaidResidents}</p>
        </div>
        
        <div className={`${styles.card} ${styles.amount}`}>
          <h2>المبلغ الإجمالي</h2>
          <p>{totalAmount.toFixed(2)} شيكل</p>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(totalAmount / expectedAmount) * 100}%` }}
          ></div>
        </div>
        <div className={styles.progressText}>
          <span>المبلغ المحصل: {totalAmount.toFixed(2)} شيكل</span>
          <span>المبلغ المتوقع: {expectedAmount.toFixed(2)} شيكل</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الشقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">الكل</option>
            <option value="paid">دفعوا</option>
            <option value="unpaid">لم يدفعوا</option>
          </select>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          {showForm ? "إلغاء" : "إضافة ساكن جديد"}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>إضافة ساكن جديد</h2>
          <form onSubmit={handleAddResident} className={styles.residentForm}>
            <div className={styles.formGroup}>
              <label>الاسم الكامل:</label>
              <input
                type="text"
                value={newResident.name}
                onChange={(e) => setNewResident({...newResident, name: e.target.value})}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>رقم الشقة:</label>
              <input
                type="text"
                value={newResident.apartment}
                onChange={(e) => setNewResident({...newResident, apartment: e.target.value})}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>حالة الدفع:</label>
              <div className={styles.paymentStatus}>
                <label>
                  <input
                    type="radio"
                    checked={newResident.isPaid}
                    onChange={() => setNewResident({...newResident, isPaid: true})}
                  />
                  دفع
                </label>
                <label>
                  <input
                    type="radio"
                    checked={!newResident.isPaid}
                    onChange={() => setNewResident({...newResident, isPaid: false})}
                  />
                  لم يدفع
                </label>
              </div>
            </div>
            
            <button type="submit" className={styles.submitButton}>إضافة الساكن</button>
          </form>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.residentsTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الشقة</th>
              <th>حالة الدفع</th>
              <th>المبلغ</th>
              <th>تاريخ الدفع</th>
              <th>تغيير الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident, index) => (
              <tr key={resident.id} className={resident.isPaid ? styles.paidRow : styles.unpaidRow}>
                <td>{index + 1}</td>
                <td>{resident.name}</td>
                <td>{resident.apartment}</td>
                <td>
                  <span className={resident.isPaid ? styles.paidStatus : styles.unpaidStatus}>
                    {resident.isPaid ? "دفع" : "لم يدفع"}
                  </span>
                </td>
                <td>{resident.amount > 0 ? `${resident.amount.toFixed(2)} شيكل` : "-"}</td>
                <td>{resident.date || "-"}</td>
                <td>
                  <button
                    onClick={() => handlePaymentChange(resident.id, !resident.isPaid)}
                    className={resident.isPaid ? styles.unpayButton : styles.payButton}
                  >
                    {resident.isPaid ? "تم الدفع" : "تسديد الآن"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <p>نظام متابعة مدفوعات العمارة © {new Date().getFullYear()}</p>
        <p>تم التطوير لتبسيط عملية متابعة المدفوعات</p>
      </footer>
    </div>
  );
}

export default HomePage;