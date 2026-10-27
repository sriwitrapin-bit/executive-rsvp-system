document.addEventListener('DOMContentLoaded', () => {
    
    // ฟังก์ชันตัดคำนำหน้าชื่อ
    const getCleanName = (fullName) => {
        const titles = [
            "ศาสตราจารย์คลินิกเกียรติคุณ", "ศาสตราจารย์คลินิกพิเศษ", "ศาสตราจารย์คลินิก", 
            "ศาสตราจารย์เกียรติคุณ", "ศาสตราจารย์กิตติคุณ", "ศาสตราจารย์", 
            "รองศาสตราจารย์", "ผู้ช่วยศาสตราจารย์", "อาจารย์",
            "นายแพทย์", "แพทย์หญิง", "นพ.", "พญ.", "ทันตแพทย์", "สัตวแพทย์หญิง", "เภสัชกร", "ภก.",
            "หม่อมหลวง", "ดร.", "เรืออากาศโท", "นาย", "นางสาว", "นาง"
        ];
        
        let clean = fullName;
        let changed = true;
        while(changed) {
            changed = false;
            clean = clean.trim();
            for(let t of titles) {
                if(clean.startsWith(t)) {
                    clean = clean.substring(t.length).trim();
                    changed = true;
                }
            }
        }
        return clean;
    };


    // 1. ระบบค้นหารายชื่อ (Custom Dropdown)
    const setupCustomDropdown = (inputId, dropdownId, otherDivId, posId) => {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        
        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== dropdown) {
                dropdown.classList.add('hidden-section');
            }
        });

        input.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            dropdown.innerHTML = '';
            
            if (val.length === 0) {
                dropdown.classList.add('hidden-section');
                return;
            }
            
            const filtered = CONFIG.executivesData.filter(exec => {
                return getCleanName(exec.name).startsWith(val) || exec.name.startsWith(val);
            });
            
            if (filtered.length > 0) {
                filtered.forEach(exec => {
                    const cleanName = getCleanName(exec.name);
                    const li = document.createElement('li');
                    li.textContent = cleanName;
                    
                    li.addEventListener('click', () => {
                        input.value = cleanName;
                        dropdown.classList.add('hidden-section');
                        handleNameChange(inputId, posId, otherDivId); 
                    });
                    dropdown.appendChild(li);
                });
            }
            
            const otherLi = document.createElement('li');
            otherLi.textContent = "อื่นๆ (โปรดระบุ)";
            otherLi.style.color = "#4b5563"; 
            otherLi.addEventListener('click', () => {
                input.value = "อื่นๆ (โปรดระบุ)";
                dropdown.classList.add('hidden-section');
                handleNameChange(inputId, posId, otherDivId);
            });
            dropdown.appendChild(otherLi);

            dropdown.classList.remove('hidden-section');
        });
        
        input.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0 && dropdown.innerHTML !== '') {
                dropdown.classList.remove('hidden-section');
            }
        });
    };

    setupCustomDropdown('selfNameInput', 'execListSelf', 'selfOtherDiv', 'selfPositionInput');
    setupCustomDropdown('execNameInput', 'execListDelegate', 'delegateOtherDiv', 'execPositionInput');

    // 2. Event Listeners for Role
    document.querySelectorAll('input[name="userRole"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('divider1').classList.remove('hidden-section');
            document.getElementById('rsvpSection').classList.remove('hidden-section');
            
            // แสดงช่องอีเมล
            document.getElementById('emailSection').classList.remove('hidden-section');
            
            if (e.target.value === 'self') {
                document.getElementById('selfSection').classList.remove('hidden-section');
                document.getElementById('delegateSection').classList.add('hidden-section');
            } else {
                document.getElementById('delegateSection').classList.remove('hidden-section');
                document.getElementById('selfSection').classList.add('hidden-section');
            }
        });
    });

    // 3. ระบบเช็คชื่อเพื่อดึงตำแหน่งอัตโนมัติ
    const handleNameChange = (inputId, posId, otherDivId) => {
        const nameVal = document.getElementById(inputId).value.trim();
        const posInput = document.getElementById(posId);
        const otherDiv = document.getElementById(otherDivId);

        if (nameVal === "อื่นๆ (โปรดระบุ)") {
            posInput.value = "";
            posInput.parentElement.classList.add('hidden-section');
            otherDiv.classList.remove('hidden-section');
            document.getElementById(otherDivId.replace('Div', 'Name')).value = "";
        } else {
            otherDiv.classList.add('hidden-section');
            
            const found = CONFIG.executivesData.find(ex => getCleanName(ex.name) === nameVal || ex.name === nameVal);
            
            if (found) {
                posInput.value = found.position;
                posInput.parentElement.classList.remove('hidden-section');
            } else {
                posInput.value = "";
                posInput.parentElement.classList.remove('hidden-section');
            }
        }
    };

    // 4. Event Listeners for RSVP Status
    document.querySelectorAll('input[name="rsvpStatus"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const logisticsSec = document.getElementById('logisticsSection');
            const repSec = document.getElementById('repDetailsSection');
            const div2 = document.getElementById('divider2');

            if (e.target.value === 'attend_self') {
                logisticsSec.classList.remove('hidden-section');
                repSec.classList.add('hidden-section');
                div2.classList.remove('hidden-section');
            } else if (e.target.value === 'attend_rep') {
                logisticsSec.classList.remove('hidden-section');
                repSec.classList.remove('hidden-section');
                div2.classList.remove('hidden-section');
            } else { // not_attend
                logisticsSec.classList.add('hidden-section');
                repSec.classList.add('hidden-section');
                div2.classList.add('hidden-section');
            }
        });
    });

    // 5. Event Listeners for Transport
    document.querySelectorAll('input[name="transportMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const otherDiv = document.getElementById('transportOtherDiv');
            if (e.target.value === 'other') {
                otherDiv.classList.remove('hidden-section');
            } else {
                otherDiv.classList.add('hidden-section');
            }
        });
    });

    // 6. Submit Button (ระบบส่งข้อมูล + บังคับกรอกครบแจ้งเตือนเดียว)
    document.getElementById('submitBtn').addEventListener('click', () => {
        
        let isValid = true;
        
        // --- ส่วนที่ 1: ตรวจสอบการกรอกข้อมูล (Validation) ---
        
        // 1. ตรวจสอบสถานะผู้ทำรายการ
        const roleSelected = document.querySelector('input[name="userRole"]:checked');
        if (!roleSelected) isValid = false;
        else if (roleSelected.value === 'self') {
            const name = document.getElementById('selfNameInput').value.trim();
            if (!name || !document.getElementById('selfPhone').value.trim()) isValid = false;
            if (name === 'อื่นๆ (โปรดระบุ)') {
                if (!document.getElementById('selfOtherName').value.trim() || !document.getElementById('selfOtherPosition').value.trim()) isValid = false;
            }
        } else {
            const execName = document.getElementById('execNameInput').value.trim();
            if (!execName || !document.getElementById('coordName').value.trim() || !document.getElementById('coordPhone').value.trim()) isValid = false;
            if (execName === 'อื่นๆ (โปรดระบุ)') {
                if (!document.getElementById('delegateOtherName').value.trim() || !document.getElementById('delegateOtherPosition').value.trim()) isValid = false;
            }
        }

        // 2. ตรวจสอบอีเมล
        const emailInput = document.getElementById('confirmEmail').value.trim();
        if (!emailInput) isValid = false;

        // 3. ตรวจสอบการเข้าร่วมงาน
        const rsvpSelected = document.querySelector('input[name="rsvpStatus"]:checked');
        if (!rsvpSelected) isValid = false;
        else if (rsvpSelected.value === 'attend_rep') {
            if (!document.getElementById('repName').value.trim() || !document.getElementById('repPosition').value.trim()) isValid = false;
        }

        // 4. ตรวจสอบการเดินทางและจำนวนคน (เฉพาะกรณีมาร่วมงาน)
        if (rsvpSelected && rsvpSelected.value !== 'not_attend') {
            if (!document.getElementById('paxCount').value.trim()) isValid = false;
            const transSelected = document.querySelector('input[name="transportMethod"]:checked');
            if (!transSelected) isValid = false;
            else if (transSelected.value === 'other') {
                if (!document.getElementById('transportOtherInput').value.trim()) isValid = false;
            }
        }

        // หากข้อมูลไม่ครบ ให้เด้ง Custom Popup แจ้งเตือนกลางจอ
        if (!isValid) {
            document.getElementById('customAlert').classList.remove('hidden-section');
            return;
        }

        // --- ส่วนที่ 2: รวบรวมข้อมูลเตรียมส่ง ---
        let formData = {
            userRole: roleSelected.value === 'self' ? 'ผู้บริหารทำรายการเอง' : 'ผู้ประสานงานทำรายการแทน',
            rsvpStatus: rsvpSelected.parentElement.innerText.trim(),
            transport: 'ไม่ระบุ',
            name: '',
            phone: '',
            position: '',
            paxCount: document.getElementById('paxCount').value || "-",
            repName: '',
            email: emailInput 
        };

        if (roleSelected.value === 'self') {
            formData.name = document.getElementById('selfNameInput').value === 'อื่นๆ (โปรดระบุ)' ? document.getElementById('selfOtherName').value : document.getElementById('selfNameInput').value;
            formData.phone = document.getElementById('selfPhone').value;
            formData.position = document.getElementById('selfPositionInput').value === '' ? document.getElementById('selfOtherPosition').value : document.getElementById('selfPositionInput').value;
        } else {
            formData.name = document.getElementById('execNameInput').value === 'อื่นๆ (โปรดระบุ)' ? document.getElementById('delegateOtherName').value : document.getElementById('execNameInput').value;
            formData.phone = document.getElementById('coordPhone').value + " (ผู้ประสานงาน: " + document.getElementById('coordName').value + ")";
            formData.position = document.getElementById('execPositionInput').value === '' ? document.getElementById('delegateOtherPosition').value : document.getElementById('execPositionInput').value;
        }

        if (rsvpSelected.value === 'attend_rep') {
            formData.repName = document.getElementById('repName').value + " (" + document.getElementById('repPosition').value + ")";
        }

        if (rsvpSelected.value !== 'not_attend') {
            const transSelected = document.querySelector('input[name="transportMethod"]:checked');
            if (transSelected) {
                formData.transport = transSelected.value === 'other' ? document.getElementById('transportOtherInput').value : transSelected.parentElement.innerText.trim();
            }
        }

        // --- ส่วนที่ 3: ส่งข้อมูล ---
        const btn = document.getElementById('submitBtn');
        btn.innerHTML = 'กำลังดำเนินการ...';
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('rsvpForm').style.display = 'none';
            document.getElementById('successMessage').classList.remove('hidden-section');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000); 

        fetch(CONFIG.scriptUrl, {
            redirect: "follow",
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log("ส่งข้อมูลไป Google Apps Script สำเร็จ");
        })
        .catch(error => {
            console.error("เกิดข้อผิดพลาดในการยิง API ข้ามโดเมน:", error);
        });
    });
});

// ระบบสำหรับปิด Popup แจ้งเตือนเมื่อแตะที่ใดก็ได้บนหน้าจอ
    document.getElementById('customAlert').addEventListener('click', function() {
        this.classList.add('hidden-section');
    });

    // ป้องกันไม่ให้คลิกโดนกล่องสีขาวแล้วปิด (ให้ปิดเฉพาะตอนคลิกพื้นหลังมืดๆ หรือข้อความ)
    document.querySelector('#customAlert > div').addEventListener('click', function(e) {
        // อนุญาตให้คลิกผ่านได้เพื่อให้ดูเป็นธรรมชาติ
    });

